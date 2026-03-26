import * as crypto from 'crypto';

export function computeMAC(params: {
  initiatingAmount: string;
  initiatingCurrencyCode: string;
  initiatingPaymentMethodCode: string;
  terminatingAmount: string;
  terminatingCurrencyCode: string;
  terminatingPaymentMethodCode: string;
  terminatingCountryCode: string;
}): string {
  const raw =
    params.initiatingAmount +
    params.initiatingCurrencyCode +
    params.initiatingPaymentMethodCode +
    params.terminatingAmount +
    params.terminatingCurrencyCode +
    params.terminatingPaymentMethodCode +
    params.terminatingCountryCode;

  return crypto.createHash('sha512').update(raw).digest('hex');
}