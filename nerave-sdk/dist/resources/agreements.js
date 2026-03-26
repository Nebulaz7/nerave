"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementsResource = void 0;
class AgreementsResource {
    constructor(http) {
        this.http = http;
    }
    async create(input) {
        return this.http.post('/agreements', input);
    }
    async get(agreementId) {
        return this.http.get(`/agreements/${agreementId}`);
    }
    async list() {
        return this.http.get('/agreements');
    }
}
exports.AgreementsResource = AgreementsResource;
//# sourceMappingURL=agreements.js.map