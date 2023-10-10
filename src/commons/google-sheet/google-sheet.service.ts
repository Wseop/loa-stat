import { Injectable, Logger } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';
import { GaxiosPromise } from 'googleapis/build/src/apis/abusiveexperiencereport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleSheetService {
  private readonly authorize: JWT;
  private readonly sheet: sheets_v4.Sheets;
  private readonly logger: Logger = new Logger(GoogleSheetService.name);

  constructor(private readonly configService: ConfigService) {
    this.authorize = new google.auth.JWT(
      this.configService.get<string>('googleSheet.clientEmail'),
      null,
      this.configService.get<string>('googleSheet.privateKey'),
      ['https://www.googleapis.com/auth/spreadsheets'],
    );
    this.sheet = google.sheets({
      version: 'v4',
      auth: this.authorize,
    });

    this.logger.log('GoogleSheetService initialized');
  }

  async get(range: string): GaxiosPromise<sheets_v4.Schema$ValueRange> {
    if (!range) {
      this.logger.warn('invalid range');
      return null;
    }

    try {
      return await this.sheet.spreadsheets.values.get({
        spreadsheetId: this.configService.get<string>('googleSheet.sheetId'),
        range,
      });
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
