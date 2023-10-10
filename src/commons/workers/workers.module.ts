import { Module } from '@nestjs/common';
import { ItemPriceModule } from './item-price/item-price.module';
import { NoticeInformModule } from './notice-informer/notice-inform.module';
import { CharacterUpdaterModule } from './character-updater/character-updater.module';
import { CacheWarmerModule } from './cache-warmer/cache-warmer.module';

@Module({
  imports: [
    ItemPriceModule,
    NoticeInformModule,
    CharacterUpdaterModule,
    CacheWarmerModule,
  ],
})
export class WorkersModule {}
