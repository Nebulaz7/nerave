import { ConfigService } from '@nestjs/config';
export declare class LegacyAuthHelper {
    private config;
    constructor(config: ConfigService);
    buildHeaders(url: string): Record<string, string>;
}
