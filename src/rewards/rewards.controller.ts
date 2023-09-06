import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { RewardsCategory } from './enums/rewards.enum';
import { RewardDto } from './dtos/reward.dto';

@ApiTags('[Rewards]')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('/:category')
  @ApiOkResponse({ type: [RewardDto] })
  @ApiParam({ name: 'category', required: true, enum: RewardsCategory })
  getRewards(@Param('category') category: RewardsCategory) {
    return this.rewardsService.getRewards(category);
  }
}
