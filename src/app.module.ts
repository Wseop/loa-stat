import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LostarkModule } from './lostark/lostark.module';
import { GoogleSheetModule } from './google-sheet/google-sheet.module';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { ChaosDungeonModule } from './chaos-dungeon/chaos-dungeon.module';
import { ItemPriceModule } from './worker/item-price/item-price.module';
import { NoticeInformModule } from './worker/notice-informer/notice-inform.module';
import { GuardianModule } from './guardian/guardian.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModule } from './character/character.module';
import { CharacterCollectModule } from './worker/character-collect/character-collect.module';
import { StatisticsModule } from './statistics/statistics.module';

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
    MongooseModule.forRoot(process.env.MONGODB_URI, { dbName: 'loa-stat' }),
    CharacterModule,
    StatisticsModule,
    GoogleSheetModule,
    LostarkModule,
    ChaosDungeonModule,
    GuardianModule,
    ItemPriceModule,
    NoticeInformModule,
    CharacterCollectModule,
  ],
})
export class AppModule {}
