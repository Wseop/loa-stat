import { Injectable } from '@nestjs/common';
import { client_email, private_key } from '../../credentials.json';
import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';

@Injectable()
export class GoogleSheetService {
  private readonly authorize: JWT;
  private readonly sheet: sheets_v4.Sheets;

  constructor() {
    this.authorize = new google.auth.JWT(client_email, null, private_key, [
      'https://www.googleapis.com/auth/spreadsheets',
    ]);
    this.sheet = google.sheets({
      version: 'v4',
      auth: this.authorize,
    });
  }

  spreadsheets(): sheets_v4.Resource$Spreadsheets {
    return this.sheet.spreadsheets;
  }
}
