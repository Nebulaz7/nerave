import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  HttpCode,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AgreementStatus, TransactionStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  @Post('interswitch')
  @HttpCode(200)
  async handleInterswitchWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-interswitch-signature') signature: string,
  ) {
    // Return 200 IMMEDIATELY — before anything else
    // Interswitch retries 5x if it doesn't get 200 fast
    res.status(200).json({ received: true });

    // Everything below runs async after 200 is sent
    try {
      // Verify signature
      const secretKey = this.config.get<string>('INTERSWITCH_SECRET_KEY') || '';
      const rawBody = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha512', secretKey as string)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
        this.logger.warn('Invalid Interswitch webhook signature — ignoring');
        return;
      }

      const event = req.body;
      this.logger.log(`Webhook received: ${event.eventType}`);

      if (event.eventType === 'TRANSACTION.COMPLETED') {
        const transactionRef = event.data?.transactionReference;
        if (!transactionRef) return;

        // Find the transaction
        const transaction = await this.prisma.transaction.findFirst({
          where: { interswitchRef: transactionRef },
        });

        if (!transaction) {
          this.logger.warn(`No transaction found for ref: ${transactionRef}`);
          return;
        }

        // Idempotency check — don't process same webhook twice
        if (transaction.status === TransactionStatus.SUCCESS) {
          this.logger.warn(`Transaction ${transactionRef} already processed — skipping`);
          return;
        }

        // Mark transaction as successful
        await this.prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: TransactionStatus.SUCCESS },
        });

        // Mark agreement as funded
        await this.prisma.agreement.update({
          where: { id: transaction.agreementId },
          data: { status: AgreementStatus.FUNDED },
        });

        this.logger.log(`Agreement ${transaction.agreementId} marked as FUNDED`);
      }
    } catch (err) {
      this.logger.error('Webhook processing error', err);
      // Never throw here — 200 already sent, just log and move on
    }
  }
}