import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        token: config.get<string>('discord.token'),
        intents: [
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.MessageContent,
        ],
        development: [config.get<string>('discord.guildId')],
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('db.uri'),
        dbName: config.get<string>('db.dbName'),
      }),
      inject: [ConfigService],
    }),
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
