import { Module } from '@nestjs/common';
import { CharacterCollectModule } from './character-collect/character-collect.module';
import { ItemPriceModule } from './item-price/item-price.module';
import { NoticeInformModule } from './notice-informer/notice-inform.module';
import { CharacterUpdateModule } from './character-update/character-update.module';
import { CacheWarmerModule } from './cache-warmer/cache-warmer.module';

@Module({
  imports: [
    CharacterCollectModule,
    ItemPriceModule,
    NoticeInformModule,
    CharacterUpdateModule,
    CacheWarmerModule,
  ],
})
export class WorkersModule {}
