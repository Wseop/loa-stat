import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { MarketPriceService } from './market-price.service';
import { MarketPriceCategory } from '../../commons/enums/market-price.enum';
import { ItemPriceDto } from './dtos/item-price.dto';
import { TripodsService } from './tripods.service';
import { ClassMap } from 'src/commons/consts/lostark.const';
import { TripodPriceDto } from './dtos/tripods.dto';

@ApiTags('[MarketPrice]')
@Controller('marketprice')
export class MarketPriceController {
  constructor(
    private readonly marketPriceService: MarketPriceService,
    private readonly tripodsService: TripodsService,
  ) {}

  @Get('/:category')
  @ApiOkResponse({ type: [ItemPriceDto] })
  @ApiParam({ name: 'category', required: true, enum: MarketPriceCategory })
  getCategoryPrice(@Param('category') category: MarketPriceCategory) {
    return this.marketPriceService.getCategoryPrice(category);
  }

  @Get('/tripods/:className')
  @ApiOkResponse({ type: [TripodPriceDto] })
  @ApiParam({ name: 'className', required: true, enum: Object.keys(ClassMap) })
  getTripodsPrice(@Param('className') className: string) {
    return this.tripodsService.getTripodsPrice(className);
  }
}
