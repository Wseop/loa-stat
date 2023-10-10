import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { MarketPriceService } from './market-price.service';
import { MarketPriceCategory } from '../../commons/enums/market-price.enum';
import { ItemPriceDto } from './dtos/item-price.dto';

@ApiTags('[MarketPrice]')
@Controller('marketprice')
export class MarketPriceController {
  constructor(private readonly marketPriceService: MarketPriceService) {}

  @Get('/:category')
  @ApiOkResponse({ type: [ItemPriceDto] })
  @ApiParam({ name: 'category', required: true, enum: MarketPriceCategory })
  getCategoryPrice(@Param('category') category: MarketPriceCategory) {
    return this.marketPriceService.getCategoryPrice(category);
  }
}