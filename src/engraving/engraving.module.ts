import { Module } from '@nestjs/common';
import { GoogleSheetModule } from 'src/google-sheet/google-sheet.module';
import { EngravingService } from './engraving.service';

@Module({
  imports: [GoogleSheetModule],
  providers: [EngravingService],
  exports: [EngravingService],
})
export class EngravingModule {}
