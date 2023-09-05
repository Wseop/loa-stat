import { Module } from '@nestjs/common';
import { GoogleSheetModule } from 'src/google-sheet/google-sheet.module';
import { ItemPriceModule } from 'src/workers/item-price/item-price.module';
import { GuardianController } from './guardian.controller';
import { GuardianService } from './guardian.service';

@Module({
  imports: [GoogleSheetModule, ItemPriceModule],
  controllers: [GuardianController],
  providers: [GuardianService],
  exports: [GuardianService],
})
export class GuardianModule {}
