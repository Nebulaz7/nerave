"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OAuthHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthHelper = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let OAuthHelper = OAuthHelper_1 = class OAuthHelper {
    config;
    logger = new common_1.Logger(OAuthHelper_1.name);
    accessToken = null;
    tokenExpiresAt = 0;
    constructor(config) {
        this.config = config;
    }
    async getAccessToken() {
        const now = Date.now();
        if (this.accessToken && now < this.tokenExpiresAt - 60_000) {
            return this.accessToken;
        }
        this.logger.log('Fetching new Interswitch OAuth token...');
        const clientId = this.config.get('INTERSWITCH_CLIENT_ID') || '';
        const secretKey = this.config.get('INTERSWITCH_SECRET_KEY') || '';
        const baseUrl = this.config.get('INTERSWITCH_BASE_URL') || '';
        const credentials = Buffer.from(`${clientId}:${secretKey}`).toString('base64');
        const response = await axios_1.default.post(`${baseUrl}/passport/oauth/token`, 'grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        this.accessToken = response.data.access_token;
        this.tokenExpiresAt = now + response.data.expires_in * 1000;
        return this.accessToken || '';
    }
};
exports.OAuthHelper = OAuthHelper;
exports.OAuthHelper = OAuthHelper = OAuthHelper_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OAuthHelper);
//# sourceMappingURL=oauth.helper.js.map