import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { CharacterStatisticsDto } from './dtos/character-statistics.dto';
import { SettingStatisticsDto } from './dtos/setting-statistics.dto';
import { SkillStatisticsDto } from './dtos/skill-statistics.dto';
import { StatisticsQueryDto } from './dtos/statistics-query.dto';

@ApiTags('[Statistics]')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/character')
  @ApiOkResponse({ type: CharacterStatisticsDto })
  getCharacterStatistics(@Query() query: StatisticsQueryDto) {
    return this.statisticsService.getCharacterStatistics(
      query.minItemLevel,
      query.maxItemLevel,
    );
  }

  @Get('/setting/:classEngraving')
  @ApiOkResponse({ type: SettingStatisticsDto })
  @ApiParam({ name: 'classEngraving', required: true, example: '광기' })
  getSettingStatistics(
    @Param('classEngraving') classEngraving: string,
    @Query() query: StatisticsQueryDto,
  ) {
    return this.statisticsService.getSettingStatistics(
      classEngraving,
      query.minItemLevel,
      query.maxItemLevel,
    );
  }

  @Get('/skill/:classEngraving')
  @ApiOkResponse({ type: SkillStatisticsDto })
  @ApiParam({ name: 'classEngraving', required: true, example: '광기' })
  getSkillStatistics(
    @Param('classEngraving') classEngraving: string,
    @Query() query: StatisticsQueryDto,
  ) {
    return this.statisticsService.getSkillStatistics(
      classEngraving,
      query.minItemLevel,
      query.maxItemLevel,
    );
  }
}
