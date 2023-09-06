import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LostarkModule } from './lostark/lostark.module';
import { GoogleSheetModule } from './google-sheet/google-sheet.module';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModule } from './character/character.module';
import { StatisticsModule } from './statistics/statistics.module';
import { WorkersModule } from './workers/workers.module';
import { MarketPriceModule } from './market-price/market-price.module';
import { RewardsModule } from './rewards/rewards.module';

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
    GoogleSheetModule,
    LostarkModule,
    RewardsModule,
    CharacterModule,
    StatisticsModule,
    MarketPriceModule,
    WorkersModule,
  ],
})
export class AppModule {}
