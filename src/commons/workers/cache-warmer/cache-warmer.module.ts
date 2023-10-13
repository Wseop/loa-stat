import { Module } from '@nestjs/common';
import { CharacterModule } from 'src/apis/character/character.module';
import { CacheWarmerService } from './cache-warmer.service';
import { RewardsModule } from 'src/apis/rewards/rewards.module';

@Module({
  imports: [CharacterModule, RewardsModule],
  providers: [CacheWarmerService],
})
export class CacheWarmerModule {}
