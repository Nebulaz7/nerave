import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { OAuthHelper } from './helpers/oauth.helper';
import { LegacyAuthHelper } from './helpers/legacy-auth.helper';
import { computeMAC } from './helpers/mac.helper';
import { AgreementStatus, TransactionType, TransactionStatus } from '@prisma/client';
import axios from 'axios';
import { randomUUID } from 'crypto';


@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly MOCK_PAYMENTS = true;


  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private oauth: OAuthHelper,
    private legacyAuth: LegacyAuthHelper,
  ) {}


  // -------------------------------------------------------
  // STEP 1 — Generate Interswitch Web Checkout payment URL
  // -------------------------------------------------------
  async initiatePayment(agreementId: string) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id: agreementId },
      include: { client: true },
    });

    if (!agreement) throw new NotFoundException('Agreement not found');
    if (agreement.status !== AgreementStatus.PENDING_PAYMENT) {
      throw new BadRequestException('Agreement is not awaiting payment');
    }

    const transactionRef = `NERAVE-${randomUUID().replace(/-/g, '').substring(0, 12).toUpperCase()}`;

    if (this.MOCK_PAYMENTS) {
      await this.prisma.transaction.create({
        data: {
          agreementId,
          interswitchRef: transactionRef,
          type: TransactionType.COLLECTION,
          status: TransactionStatus.PENDING,
        },
      });

      return {
        paymentUrl: `http://localhost:3000/api/v1/payments/mock-pay/${transactionRef}`,
        transactionReference: transactionRef,
        note: 'MOCK MODE - real Interswitch credentials pending',
      };
    }

    const token = await this.oauth.getAccessToken();
    const baseUrl = this.config.get<string>('INTERSWITCH_BASE_URL');

    // Amount in kobo (multiply naira by 100)
    const amountInKobo = Number(agreement.totalAmount) * 100;

    const payload = {
      merchantCode: this.config.get<string>('INTERSWITCH_CLIENT_ID'),
      payableCode: this.config.get<string>('INTERSWITCH_TERMINAL_ID'),
      amount: amountInKobo,
      transactionReference: transactionRef,
      currencyCode: '566', // NGN
      customerEmail: agreement.client.email,
      redirectUrl: `${this.config.get('APP_URL')}/api/v1/payments/verify/${transactionRef}`,
    };

    const response = await axios.post(
      `${baseUrl}/collections/api/v1/purchases`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // Save transaction record
    await this.prisma.transaction.create({
      data: {
        agreementId,
        interswitchRef: transactionRef,
        type: TransactionType.COLLECTION,
        status: TransactionStatus.PENDING,
      },
    });

    return {
      paymentUrl: response.data.redirectUrl,
      transactionReference: transactionRef,
    };
  }

  // -------------------------------------------------------
  // STEP 2 — Verify payment after redirect
  // -------------------------------------------------------
  async verifyPayment(transactionRef: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { interswitchRef: transactionRef },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    if (this.MOCK_PAYMENTS) {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: TransactionStatus.SUCCESS },
      });

      await this.prisma.agreement.update({
        where: { id: transaction.agreementId },
        data: { status: AgreementStatus.FUNDED },
      });

      return {
        success: true,
        responseCode: '00',
        transactionReference: transactionRef,
        note: 'mock mode',
      };
    }

    const token = await this.oauth.getAccessToken();
    const baseUrl = this.config.get<string>('INTERSWITCH_BASE_URL');

    const response = await axios.get(
      `${baseUrl}/collections/api/v1/purchases/${transactionRef}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const isSuccess = response.data.responseCode === '00';

    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: isSuccess ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
      },
    });

    if (isSuccess) {
      await this.prisma.agreement.update({
        where: { id: transaction.agreementId },
        data: { status: AgreementStatus.FUNDED },
      });
    }

    return {
      success: isSuccess,
      responseCode: response.data.responseCode,
      transactionReference: transactionRef,
    };
  }

  // -------------------------------------------------------
  // STEP 3 — Called when MilestoneApproved fires on-chain
  // -------------------------------------------------------
  async disburseMilestone(agreementId: string, milestoneIndex: number) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id: agreementId },
      include: {
        milestones: { orderBy: { createdAt: 'asc' } },
        contractor: true,
      },
    });

    if (!agreement) throw new NotFoundException('Agreement not found');

    const milestone = agreement.milestones[milestoneIndex];
    if (!milestone) throw new NotFoundException('Milestone not found');
    if (milestone.disbursed) {
      this.logger.warn(`Milestone ${milestone.id} already disbursed — skipping`);
      return;
    }

    if (this.MOCK_PAYMENTS) {
      const transferRef = `NERAVE-D-${randomUUID().replace(/-/g, '').substring(0, 10).toUpperCase()}`;

      await this.prisma.transaction.create({
        data: {
          agreementId,
          milestoneId: milestone.id,
          interswitchRef: transferRef,
          type: TransactionType.DISBURSEMENT,
          status: TransactionStatus.SUCCESS,
        },
      });

      await this.prisma.milestone.update({
        where: { id: milestone.id },
        data: { disbursed: true },
      });

      const remaining = await this.prisma.milestone.count({
        where: { agreementId, disbursed: false },
      });

      if (remaining === 0) {
        await this.prisma.agreement.update({
          where: { id: agreementId },
          data: { status: AgreementStatus.COMPLETED },
        });
      }

      this.logger.log(`[MOCK] Milestone ${milestone.id} disbursed — ref: ${transferRef}`);
      return;
    }

    const amountInKobo = (Number(milestone.amount) * 100).toString();
    const transferUrl = this.config.get<string>('INTERSWITCH_TRANSFER_URL');

    // --- Sub-step A: validate contractor bank account (legacy auth) ---
    const nameEnquiryUrl = `${transferUrl}/api/v1/nameenquiry/banks/accounts/names`;
    const legacyHeaders = this.legacyAuth.buildHeaders(nameEnquiryUrl);

    const nameEnquiry = await axios.get(nameEnquiryUrl, {
      headers: {
        ...legacyHeaders,
        bankCode: '058',                      // GTB — use real contractor bank code in prod
        accountId: '0014261063',              // use real contractor account in prod
      },
    });

    this.logger.log(`Account validated: ${nameEnquiry.data.accountName}`);

    // --- Sub-step B: compute MAC ---
    const mac = computeMAC({
      initiatingAmount: amountInKobo,
      initiatingCurrencyCode: '566',
      initiatingPaymentMethodCode: 'AC',
      terminatingAmount: amountInKobo,
      terminatingCurrencyCode: '566',
      terminatingPaymentMethodCode: 'AC',
      terminatingCountryCode: 'NG',
    });

    // --- Sub-step C: execute transfer (OAuth bearer) ---
    const token = await this.oauth.getAccessToken();
    const transferRef = `NERAVE-D-${randomUUID().replace(/-/g, '').substring(0, 10).toUpperCase()}`;

    const transferPayload = {
      mac,
      transferCode: 'TRF',
      beneficiaryBankCode: '058',
      beneficiaryAccountNumber: '0014261063', // use real contractor account in prod
      amount: amountInKobo,
      currencyCode: '566',
      narration: `Nerave milestone: ${milestone.title}`,
      senderName: 'Nerave Escrow',
      beneficiaryName: nameEnquiry.data.accountName,
      transferRef,
    };

    const transferResponse = await axios.post(
      `${transferUrl}/quicktellerservice/api/v5/transactions/TransferFunds`,
      transferPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // --- Sub-step D: store transaction reference ---
    await this.prisma.transaction.create({
      data: {
        agreementId,
        milestoneId: milestone.id,
        interswitchRef: transferResponse.data.transactionReference ?? transferRef,
        type: TransactionType.DISBURSEMENT,
        status: TransactionStatus.SUCCESS,
      },
    });

    // Mark milestone as disbursed
    await this.prisma.milestone.update({
      where: { id: milestone.id },
      data: { disbursed: true },
    });

    // Check if all milestones disbursed — mark agreement complete
    const remaining = await this.prisma.milestone.count({
      where: { agreementId, disbursed: false },
    });

    if (remaining === 0) {
      await this.prisma.agreement.update({
        where: { id: agreementId },
        data: { status: AgreementStatus.COMPLETED },
      });
    }

    this.logger.log(`Milestone ${milestone.id} disbursed — ref: ${transferRef}`);
  }
}