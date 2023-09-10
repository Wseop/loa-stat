import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { SettingStatisticsDto } from './dtos/setting-statistics.dto';
import { SkillStatisticsDto } from './dtos/skill-statistics.dto';
import { StatisticsQueryDto } from './dtos/statistics-query.dto';
import { ServerStatisticsDto } from './dtos/server-statistics.dto';
import { ClassEngravingStatisticsDto } from './dtos/class-engraving-statistics.dto';

@ApiTags('[Statistics]')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/character/server')
  @ApiOkResponse({ type: ServerStatisticsDto })
  getServerStatistics(@Query() query: StatisticsQueryDto) {
    return this.statisticsService.getServerStatistics(
      query.minItemLevel,
      query.maxItemLevel,
    );
  }

  @Get('/character/classEngraving')
  @ApiOkResponse({ type: ClassEngravingStatisticsDto })
  getClassEngravingStatistics(@Query() query: StatisticsQueryDto) {
    return this.statisticsService.getClassEngravingStatistics(
      query.minItemLevel,
      query.maxItemLevel,
    );
  }

  @Get('/character/setting/:classEngraving')
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

  @Get('/character/skill/:classEngraving')
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
