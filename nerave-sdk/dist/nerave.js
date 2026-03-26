"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nerave = void 0;
const http_1 = require("./http");
const agreements_1 = require("./resources/agreements");
const milestones_1 = require("./resources/milestones");
const payments_1 = require("./resources/payments");
class Nerave {
    constructor(config) {
        var _a;
        const envKeyName = config.apiKeyEnvVar || 'NERAVE_API_KEY';
        const envApiKey = typeof process !== 'undefined' ? (_a = process.env) === null || _a === void 0 ? void 0 : _a[envKeyName] : undefined;
        const apiKey = config.apiKey || envApiKey;
        if (!apiKey) {
            throw new Error(`Nerave SDK requires an apiKey. Provide config.apiKey or set ${envKeyName} in your environment.`);
        }
        const http = new http_1.HttpClient({
            apiKey,
            baseUrl: config.baseUrl,
        });
        this.agreements = new agreements_1.AgreementsResource(http);
        this.milestones = new milestones_1.MilestonesResource(http);
        this.payments = new payments_1.PaymentsResource(http);
    }
}
exports.Nerave = Nerave;
//# sourceMappingURL=nerave.js.map