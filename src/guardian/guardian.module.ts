import { Module } from '@nestjs/common';
import { GoogleSheetModule } from 'src/google-sheet/google-sheet.module';
import { GuardianController } from './guardian.controller';
import { GuardianService } from './guardian.service';
import { MarketPriceModule } from 'src/market-price/market-price.module';

@Module({
  imports: [GoogleSheetModule, MarketPriceModule],
  controllers: [GuardianController],
  providers: [GuardianService],
  exports: [GuardianService],
})
export class GuardianModule {}
