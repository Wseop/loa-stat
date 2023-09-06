import { AuctionItemCategory } from '../enums/lostark.enum';

export interface RequestAuctionItem {
  categoryCode: AuctionItemCategory;
  pageNo: number;
  itemName?: string;
  itemGrade?: string;
  itemQuality?: number;
  characterClass?: string;
  skillOptions?: SearchDetailOption[];
  etcOptions?: SearchDetailOption[];
}

export interface SearchDetailOption {
  FirstOption?: number;
  SecondOption?: number;
  MinValue?: number;
  MaxValue?: number;
}

export interface AuctionItem {
  itemName: string;
  itemGrade: string;
  itemQuality?: number;
  options: AuctionItemOption[];
  buyPrice: number;
}

export interface AuctionItemOption {
  optionName: string;
  tripod: string;
  value: number;
  isPenalty: boolean;
  className: string;
}
