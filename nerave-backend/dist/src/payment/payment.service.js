"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const oauth_helper_1 = require("./helpers/oauth.helper");
const legacy_auth_helper_1 = require("./helpers/legacy-auth.helper");
const mac_helper_1 = require("./helpers/mac.helper");
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    prisma;
    config;
    oauth;
    legacyAuth;
    logger = new common_1.Logger(PaymentsService_1.name);
    MOCK_PAYMENTS = true;
    constructor(prisma, config, oauth, legacyAuth) {
        this.prisma = prisma;
        this.config = config;
        this.oauth = oauth;
        this.legacyAuth = legacyAuth;
    }
    async initiatePayment(agreementId) {
        const agreement = await this.prisma.agreement.findUnique({
            where: { id: agreementId },
            include: { client: true },
        });
        if (!agreement)
            throw new common_1.NotFoundException('Agreement not found');
        if (agreement.status !== client_1.AgreementStatus.PENDING_PAYMENT) {
            throw new common_1.BadRequestException('Agreement is not awaiting payment');
        }
        const transactionRef = `NERAVE-${(0, crypto_1.randomUUID)().replace(/-/g, '').substring(0, 12).toUpperCase()}`;
        if (this.MOCK_PAYMENTS) {
            await this.prisma.transaction.create({
                data: {
                    agreementId,
                    interswitchRef: transactionRef,
                    type: client_1.TransactionType.COLLECTION,
                    status: client_1.TransactionStatus.PENDING,
                },
            });
            return {
                paymentUrl: `http://localhost:3000/api/v1/payments/mock-pay/${transactionRef}`,
                transactionReference: transactionRef,
                note: 'MOCK MODE - real Interswitch credentials pending',
            };
        }
        const token = await this.oauth.getAccessToken();
        const baseUrl = this.config.get('INTERSWITCH_BASE_URL');
        const amountInKobo = Number(agreement.totalAmount) * 100;
        const payload = {
            merchantCode: this.config.get('INTERSWITCH_CLIENT_ID'),
            payableCode: this.config.get('INTERSWITCH_TERMINAL_ID'),
            amount: amountInKobo,
            transactionReference: transactionRef,
            currencyCode: '566',
            customerEmail: agreement.client.email,
            redirectUrl: `${this.config.get('APP_URL')}/api/v1/payments/verify/${transactionRef}`,
        };
        const response = await axios_1.default.post(`${baseUrl}/collections/api/v1/purchases`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        await this.prisma.transaction.create({
            data: {
                agreementId,
                interswitchRef: transactionRef,
                type: client_1.TransactionType.COLLECTION,
                status: client_1.TransactionStatus.PENDING,
            },
        });
        return {
            paymentUrl: response.data.redirectUrl,
            transactionReference: transactionRef,
        };
    }
    async verifyPayment(transactionRef) {
        const transaction = await this.prisma.transaction.findFirst({
            where: { interswitchRef: transactionRef },
        });
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        if (this.MOCK_PAYMENTS) {
            await this.prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: client_1.TransactionStatus.SUCCESS },
            });
            await this.prisma.agreement.update({
                where: { id: transaction.agreementId },
                data: { status: client_1.AgreementStatus.FUNDED },
            });
            return {
                success: true,
                responseCode: '00',
                transactionReference: transactionRef,
                note: 'mock mode',
            };
        }
        const token = await this.oauth.getAccessToken();
        const baseUrl = this.config.get('INTERSWITCH_BASE_URL');
        const response = await axios_1.default.get(`${baseUrl}/collections/api/v1/purchases/${transactionRef}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const isSuccess = response.data.responseCode === '00';
        await this.prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                status: isSuccess ? client_1.TransactionStatus.SUCCESS : client_1.TransactionStatus.FAILED,
            },
        });
        if (isSuccess) {
            await this.prisma.agreement.update({
                where: { id: transaction.agreementId },
                data: { status: client_1.AgreementStatus.FUNDED },
            });
        }
        return {
            success: isSuccess,
            responseCode: response.data.responseCode,
            transactionReference: transactionRef,
        };
    }
    async disburseMilestone(agreementId, milestoneIndex) {
        const agreement = await this.prisma.agreement.findUnique({
            where: { id: agreementId },
            include: {
                milestones: { orderBy: { createdAt: 'asc' } },
                contractor: true,
            },
        });
        if (!agreement)
            throw new common_1.NotFoundException('Agreement not found');
        const milestone = agreement.milestones[milestoneIndex];
        if (!milestone)
            throw new common_1.NotFoundException('Milestone not found');
        if (milestone.disbursed) {
            this.logger.warn(`Milestone ${milestone.id} already disbursed — skipping`);
            return;
        }
        if (this.MOCK_PAYMENTS) {
            const transferRef = `NERAVE-D-${(0, crypto_1.randomUUID)().replace(/-/g, '').substring(0, 10).toUpperCase()}`;
            await this.prisma.transaction.create({
                data: {
                    agreementId,
                    milestoneId: milestone.id,
                    interswitchRef: transferRef,
                    type: client_1.TransactionType.DISBURSEMENT,
                    status: client_1.TransactionStatus.SUCCESS,
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
                    data: { status: client_1.AgreementStatus.COMPLETED },
                });
            }
            this.logger.log(`[MOCK] Milestone ${milestone.id} disbursed — ref: ${transferRef}`);
            return;
        }
        const amountInKobo = (Number(milestone.amount) * 100).toString();
        const transferUrl = this.config.get('INTERSWITCH_TRANSFER_URL');
        const nameEnquiryUrl = `${transferUrl}/api/v1/nameenquiry/banks/accounts/names`;
        const legacyHeaders = this.legacyAuth.buildHeaders(nameEnquiryUrl);
        const nameEnquiry = await axios_1.default.get(nameEnquiryUrl, {
            headers: {
                ...legacyHeaders,
                bankCode: '058',
                accountId: '0014261063',
            },
        });
        this.logger.log(`Account validated: ${nameEnquiry.data.accountName}`);
        const mac = (0, mac_helper_1.computeMAC)({
            initiatingAmount: amountInKobo,
            initiatingCurrencyCode: '566',
            initiatingPaymentMethodCode: 'AC',
            terminatingAmount: amountInKobo,
            terminatingCurrencyCode: '566',
            terminatingPaymentMethodCode: 'AC',
            terminatingCountryCode: 'NG',
        });
        const token = await this.oauth.getAccessToken();
        const transferRef = `NERAVE-D-${(0, crypto_1.randomUUID)().replace(/-/g, '').substring(0, 10).toUpperCase()}`;
        const transferPayload = {
            mac,
            transferCode: 'TRF',
            beneficiaryBankCode: '058',
            beneficiaryAccountNumber: '0014261063',
            amount: amountInKobo,
            currencyCode: '566',
            narration: `Nerave milestone: ${milestone.title}`,
            senderName: 'Nerave Escrow',
            beneficiaryName: nameEnquiry.data.accountName,
            transferRef,
        };
        const transferResponse = await axios_1.default.post(`${transferUrl}/quicktellerservice/api/v5/transactions/TransferFunds`, transferPayload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        await this.prisma.transaction.create({
            data: {
                agreementId,
                milestoneId: milestone.id,
                interswitchRef: transferResponse.data.transactionReference ?? transferRef,
                type: client_1.TransactionType.DISBURSEMENT,
                status: client_1.TransactionStatus.SUCCESS,
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
                data: { status: client_1.AgreementStatus.COMPLETED },
            });
        }
        this.logger.log(`Milestone ${milestone.id} disbursed — ref: ${transferRef}`);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        oauth_helper_1.OAuthHelper,
        legacy_auth_helper_1.LegacyAuthHelper])
], PaymentsService);
//# sourceMappingURL=payment.service.js.map