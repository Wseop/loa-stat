import { Module } from '@nestjs/common';
import { CharacterCollectModule } from './character-collect/character-collect.module';
import { ItemPriceModule } from './item-price/item-price.module';
import { NoticeInformModule } from './notice-informer/notice-inform.module';
import { CharacterUpdateModule } from './character-update/character-update.module';

@Module({
  imports: [
    CharacterCollectModule,
    ItemPriceModule,
    NoticeInformModule,
    CharacterUpdateModule,
  ],
})
export class WorkersModule {}
