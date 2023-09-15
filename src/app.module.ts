import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LostarkModule } from './lostark/lostark.module';
import { GoogleSheetModule } from './google-sheet/google-sheet.module';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModule } from './character/character.module';
import { WorkersModule } from './workers/workers.module';
import { MarketPriceModule } from './market-price/market-price.module';
import { RewardsModule } from './rewards/rewards.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

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
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://redis:6379',
      isGlobal: true,
    }),
    GoogleSheetModule,
    LostarkModule,
    RewardsModule,
    CharacterModule,
    MarketPriceModule,
    WorkersModule,
  ],
})
export class AppModule {}
