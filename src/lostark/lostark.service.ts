import { Injectable, Logger } from '@nestjs/common';
import { client_email, private_key } from '../../credentials.json';
import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';

@Injectable()
export class LostarkService {
  private readonly authorize: JWT;
  private readonly sheet: sheets_v4.Sheets;
  private readonly logger: Logger = new Logger(LostarkService.name);
  private readonly apiKeys: string[] = [];
  private apiKeyIndex: number = 0;

  constructor() {
    this.authorize = new google.auth.JWT(client_email, null, private_key, [
      'https://www.googleapis.com/auth/spreadsheets',
    ]);
    this.sheet = google.sheets({
      version: 'v4',
      auth: this.authorize,
    });
    this.loadApiKey();
  }

  private async loadApiKey() {
    try {
      const result = await this.sheet.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_API_KEY,
        range: 'A:A',
      });

      if (result?.data?.values) {
        result.data.values.forEach((value) => {
          this.apiKeys.push(value[0]);
        });
      } else {
        this.logger.warn('failed to load apikey');
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  // Round-Robin 방식으로 apikey 사용
  async getApiKey() {
    if (this.apiKeys.length <= 0) return null;
    if (this.apiKeyIndex >= this.apiKeys.length) this.apiKeyIndex = 0;
    return this.apiKeys[this.apiKeyIndex++];
  }
}
