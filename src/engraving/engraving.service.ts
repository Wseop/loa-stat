import { Injectable, Logger } from '@nestjs/common';
import { GoogleSheetService } from 'src/google-sheet/google-sheet.service';
import { ClassEngravings } from './interfaces/engraving.interface';

@Injectable()
export class EngravingService {
  private readonly logger: Logger = new Logger(EngravingService.name);
  private engravings: string[] = [];
  private classEngravings: ClassEngravings = {};

  constructor(private readonly googleSheetService: GoogleSheetService) {
    this.loadData();
  }

  private async loadData() {
    const result = await this.googleSheetService.get('engraving!A:B');

    if (result?.data?.values) {
      result.data.values.forEach((row) => {
        if (row[1]) {
          if (this.classEngravings[row[1]]) {
            this.classEngravings[row[1]].push(row[0]);
          } else {
            this.classEngravings[row[1]] = [row[0]];
          }
        } else {
          this.engravings.push(row[0]);
        }
      });
      this.logger.log('Engraving data initialized');
    } else {
      this.logger.error('engraving data load fail');
    }
  }

  isClassEngraving(engraving: string): boolean {
    for (let key in this.classEngravings) {
      if (this.classEngravings[key].includes(engraving)) return true;
    }
    return false;
  }

  getClassEngravings(): ClassEngravings {
    return JSON.parse(JSON.stringify(this.classEngravings));
  }
}
