import { Injectable, Logger } from '@nestjs/common';
import { GoogleSheetService } from 'src/google-sheet/google-sheet.service';

@Injectable()
export class LostarkService {
  private readonly logger: Logger = new Logger(LostarkService.name);
  private readonly apiKeys: string[] = [];
  private apiKeyIndex: number = 0;

  constructor(private readonly googleSheetService: GoogleSheetService) {
    this.loadApiKey();
  }

  private async loadApiKey() {
    try {
      const result = await this.googleSheetService.spreadsheets().values.get({
        spreadsheetId: process.env.SHEET_API_KEY,
        range: 'A:A',
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
  async getApiKey() {
    if (this.apiKeys.length <= 0) return null;
    if (this.apiKeyIndex >= this.apiKeys.length) this.apiKeyIndex = 0;
    return this.apiKeys[this.apiKeyIndex++];
  }
}
