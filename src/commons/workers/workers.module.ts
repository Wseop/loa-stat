import { Module } from '@nestjs/common';
import { ItemPriceModule } from './item-price/item-price.module';
import { NoticeInformModule } from './notice-informer/notice-inform.module';
import { CharacterUpdateModule } from './character-update/character-update.module';
import { CacheWarmerModule } from './cache-warmer/cache-warmer.module';

@Module({
  imports: [
    ItemPriceModule,
    NoticeInformModule,
    CharacterUpdateModule,
    CacheWarmerModule,
  ],
})
export class WorkersModule {}
