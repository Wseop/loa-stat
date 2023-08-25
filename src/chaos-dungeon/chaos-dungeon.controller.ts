import { Controller, Get } from '@nestjs/common';
import { ChaosDungeonService } from './chaos-dungeon.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChaosRewardDto } from './dtos/chaos-reward.dto';

@ApiTags('[Chaos-Dungeon]')
@Controller('chaos')
export class ChaosDungeonController {
  constructor(private readonly chaosDungeonService: ChaosDungeonService) {}

  @Get('/reward')
  @ApiOkResponse({ type: [ChaosRewardDto] })
  getReward() {
    return this.chaosDungeonService.getAvgReward();
  }
}
