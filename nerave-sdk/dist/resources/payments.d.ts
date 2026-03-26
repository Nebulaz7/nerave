import { HttpClient } from '../http';
import { InitiatePaymentResponse, VerifyPaymentResponse } from '../types';
export declare class PaymentsResource {
    private http;
    constructor(http: HttpClient);
    initiate(agreementId: string): Promise<InitiatePaymentResponse>;
    verify(transactionRef: string): Promise<VerifyPaymentResponse>;
}
//# sourceMappingURL=payments.d.ts.map