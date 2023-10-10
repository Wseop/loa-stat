import { Module } from '@nestjs/common';
import { CharacterModule } from 'src/apis/character/character.module';
import { CacheWarmerService } from './cache-warmer.service';

@Module({
  imports: [CharacterModule],
  providers: [CacheWarmerService],
})
export class CacheWarmerModule {}
