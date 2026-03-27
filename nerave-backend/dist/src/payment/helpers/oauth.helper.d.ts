import { ConfigService } from '@nestjs/config';
export declare class OAuthHelper {
    private config;
    private readonly logger;
    private accessToken;
    private tokenExpiresAt;
    constructor(config: ConfigService);
    getAccessToken(): Promise<string>;
}
