import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { GoogleSheetService } from 'src/google-sheet/google-sheet.service';
import { LostarkNotice } from './interfaces/lostark-notice.interface';

@Injectable()
export class LostarkService {
  private readonly logger: Logger = new Logger(LostarkService.name);
  private readonly apiUrl: string =
    'https://developer-lostark.game.onstove.com';
  private readonly apiKeys: string[] = [];
  private apiKeyIndex: number = 0;

  constructor(private readonly googleSheetService: GoogleSheetService) {
    this.loadApiKey();
  }

  private async loadApiKey() {
    try {
      const result = await this.googleSheetService.spreadsheets().values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: 'apikey!A:A',
      });

      if (result?.data?.values) {
        result.data.values.forEach((value) => {
          this.apiKeys.push(value[0]);
        });
        this.logger.log('ApiKey load success');
      } else {
        this.logger.error('ApiKey load fail');
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  // Round-Robin 방식으로 apikey 사용
  private getApiKey(): string {
    if (this.apiKeys.length <= 0) return null;
    if (this.apiKeyIndex >= this.apiKeys.length) this.apiKeyIndex = 0;
    return this.apiKeys[this.apiKeyIndex++];
  }

  async getNotices(): Promise<LostarkNotice[]> {
    try {
      const result = await axios.get(`${this.apiUrl}/news/notices`, {
        headers: {
          Accept: 'application/json',
          Authorization: `bearer ${this.getApiKey()}`,
        },
      });

      if (result?.data) {
        const notices: LostarkNotice[] = [];

        result.data.forEach(
          (value: {
            Title: string;
            Date: string;
            Link: string;
            Type: string;
          }) => {
            notices.push({
              noticeId: Number(
                value.Link.replace(
                  'https://lostark.game.onstove.com/News/Notice/Views/',
                  '',
                ),
              ),
              title: value.Title,
              date: new Date(value.Date),
              link: value.Link,
            });
          },
        );

        return notices;
      } else {
        return null;
      }
    } catch (error) {
      if (error.response) this.logger.error(error.response.status);
      else if (error.request) this.logger.error(error.request);
      else this.logger.error(error.message);
    }
  }
}
