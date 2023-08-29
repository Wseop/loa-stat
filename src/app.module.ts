import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LostarkModule } from './lostark/lostark.module';
import { GoogleSheetModule } from './google-sheet/google-sheet.module';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { ChaosDungeonModule } from './chaos-dungeon/chaos-dungeon.module';
import { ItemPriceModule } from './worker/item-price/item-price.module';
import { NoticeInformModule } from './worker/notice-informer/notice-inform.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NecordModule.forRoot({
      token: process.env.BOT_TOKEN,
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent,
      ],
      development: [process.env.GUILD_ID],
    }),
    GoogleSheetModule,
    LostarkModule,
    ChaosDungeonModule,
    ItemPriceModule,
    NoticeInformModule,
  ],
})
export class AppModule {}
