import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class LegacyAuthHelper {
  constructor(private config: ConfigService) {}

  buildHeaders(url: string): Record<string, string> {
    const clientId = this.config.get<string>('INTERSWITCH_CLIENT_ID') || '';
    const secretKey = this.config.get<string>('INTERSWITCH_SECRET_KEY') || '';
    const terminalId = this.config.get<string>('INTERSWITCH_TERMINAL_ID') || '';

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    const signatureMethod = 'HmacSHA1';

    // Signature = base64(sha1("GET&{url}&{timestamp}&{nonce}&{clientId}&{secretKey}"))
    const signatureString = `GET&${url}&${timestamp}&${nonce}&${clientId}&${secretKey}`;
    const signature = crypto
      .createHmac('sha1', secretKey as string)
      .update(signatureString)
      .digest('base64');

    // InterswitchAuth header format
    const authHeader =
      `InterswitchAuth realm="InterswitchAuth",` +
      `oauth_consumer_key="${clientId}",` +
      `oauth_signature_method="${signatureMethod}",` +
      `oauth_timestamp="${timestamp}",` +
      `oauth_nonce="${nonce}",` +
      `oauth_signature="${signature}"`;

    return {
      InterswitchAuth: authHeader,
      Signature: signature,
      Timestamp: timestamp,
      Nonce: nonce,
      SignatureMethod: signatureMethod,
      TerminalID: terminalId,
    };
  }
}