import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OAuthHelper {
  private readonly logger = new Logger(OAuthHelper.name);
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(private config: ConfigService) {}

  async getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 60s buffer)
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpiresAt - 60_000) {
      return this.accessToken;
    }

    this.logger.log('Fetching new Interswitch OAuth token...');

    const clientId = this.config.get<string>('INTERSWITCH_CLIENT_ID') || '';
    const secretKey = this.config.get<string>('INTERSWITCH_SECRET_KEY') || '';
    const baseUrl = this.config.get<string>('INTERSWITCH_BASE_URL') || '';

    // Base64 encode clientId:secretKey
    const credentials = Buffer.from(`${clientId}:${secretKey}`).toString('base64');

    const response = await axios.post(
      `${baseUrl}/passport/oauth/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    this.accessToken = response.data.access_token;
    // expires_in is in seconds — convert to ms and store expiry timestamp
    this.tokenExpiresAt = now + response.data.expires_in * 1000;

    return this.accessToken || '';
  }
}