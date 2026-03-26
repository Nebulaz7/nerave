"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsResource = void 0;
class PaymentsResource {
    constructor(http) {
        this.http = http;
    }
    async initiate(agreementId) {
        return this.http.post(`/payments/initiate/${agreementId}`);
    }
    async verify(transactionRef) {
        return this.http.get(`/payments/verify/${transactionRef}`);
    }
}
exports.PaymentsResource = PaymentsResource;
//# sourceMappingURL=payments.js.map