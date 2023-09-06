import { Module } from '@nestjs/common';
import { GoogleSheetModule } from 'src/google-sheet/google-sheet.module';
import { MarketPriceModule } from 'src/market-price/market-price.module';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

@Module({
  imports: [GoogleSheetModule, MarketPriceModule],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}
