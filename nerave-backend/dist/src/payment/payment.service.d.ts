import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { OAuthHelper } from './helpers/oauth.helper';
import { LegacyAuthHelper } from './helpers/legacy-auth.helper';
export declare class PaymentsService {
    private prisma;
    private config;
    private oauth;
    private legacyAuth;
    private readonly logger;
    private readonly MOCK_PAYMENTS;
    constructor(prisma: PrismaService, config: ConfigService, oauth: OAuthHelper, legacyAuth: LegacyAuthHelper);
    initiatePayment(agreementId: string): Promise<{
        paymentUrl: string;
        transactionReference: string;
        note: string;
    } | {
        paymentUrl: any;
        transactionReference: string;
        note?: undefined;
    }>;
    verifyPayment(transactionRef: string): Promise<{
        success: boolean;
        responseCode: string;
        transactionReference: string;
        note: string;
    } | {
        success: boolean;
        responseCode: any;
        transactionReference: string;
        note?: undefined;
    }>;
    disburseMilestone(agreementId: string, milestoneIndex: number): Promise<void>;
}
