import { HttpClient } from '../http';
import {
  InitiatePaymentResponse,
  VerifyPaymentResponse,
} from '../types';

export class PaymentsResource {
  constructor(private http: HttpClient) {}

  async initiate(agreementId: string): Promise<InitiatePaymentResponse> {
    return this.http.post<InitiatePaymentResponse>(
      `/payments/initiate/${agreementId}`,
    );
  }

  async verify(transactionRef: string): Promise<VerifyPaymentResponse> {
    return this.http.get<VerifyPaymentResponse>(
      `/payments/verify/${transactionRef}`,
    );
  }
}