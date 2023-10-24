import { MarketItemCategory } from '../../enums/lostark.enum';

export interface RequestMarketItem {
  categoryCode: MarketItemCategory;
  pageNo: number;
  characterClass?: string;
  itemGrade?: string;
  itemName?: string;
}

export interface MarketItem {
  itemName: string;
  itemGrade: string;
  iconPath: string;
  minPrice: number;
}

export interface APIResultMarketItemAvg {
  Name: string;
  TradeRemainCount: number;
  BundleCount: number;
  Stats: {
    Date: string;
    AvgPrice: number;
    TradeCount: number;
  }[];
  ToolTip: string;
}

export interface APIResultMarketItem {
  PageNo: number;
  PageSize: number;
  TotalCout: number;
  Items: {
    Id: number;
    Name: string;
    Grade: string;
    Icon: string;
    BundleCount: number;
    TradeRemainCount: number;
    YDayAvgPrice: number;
    RecentPrice: number;
    CurrentMinPrice: number;
  }[];
}
