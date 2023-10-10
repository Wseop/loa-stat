import { Module } from '@nestjs/common';
import { CharacterCrawlerService } from './character-crawler.service';
import { CharacterModule } from 'src/apis/character/character.module';

@Module({
  imports: [CharacterModule],
  providers: [CharacterCrawlerService],
  exports: [CharacterCrawlerService],
})
export class CharacterCrawlerModule {}
