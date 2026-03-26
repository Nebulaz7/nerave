"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
class HttpClient {
    constructor(config) {
        this.client = axios_1.default.create({
            baseURL: config.baseUrl || 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.apiKey,
            },
            timeout: 30000,
        });
        // Response interceptor — normalize errors
        this.client.interceptors.response.use((response) => response, (error) => {
            var _a, _b, _c, _d, _e;
            const status = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 500;
            const message = ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) ||
                error.message ||
                'An unexpected error occurred';
            const neraveError = new Error(message);
            neraveError.statusCode = status;
            neraveError.raw = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data;
            return Promise.reject(neraveError);
        });
    }
    async get(path) {
        const response = await this.client.get(path);
        return response.data;
    }
    async post(path, body) {
        const response = await this.client.post(path, body);
        return response.data;
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=http.js.map