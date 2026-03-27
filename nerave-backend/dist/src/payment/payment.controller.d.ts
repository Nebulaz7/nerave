import { PaymentsService } from './payment.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    initiate(agreementId: string): Promise<{
        paymentUrl: string;
        transactionReference: string;
        note: string;
    } | {
        paymentUrl: any;
        transactionReference: string;
        note?: undefined;
    }>;
    verify(transactionRef: string): Promise<{
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
    mockPay(transactionRef: string): Promise<{
        message: string;
        transactionRef: string;
    }>;
}
