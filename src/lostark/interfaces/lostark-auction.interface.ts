import { AuctionItemCategory } from '../enums/lostark-item.enum';

export class RequestAuctionItem {
  categoryCode: (typeof AuctionItemCategory)[keyof typeof AuctionItemCategory];
  pageNo: number;
  itemName?: string;
  itemGrade?: string;
  itemQuality?: number;
  characterClass?: string;
  skillOptions?: SearchDetailOption[];
  etcOptions?: SearchDetailOption[];
}

export class SearchDetailOption {
  FirstOption?: number;
  SecondOption?: number;
  MinValue?: number;
  MaxValue?: number;
}

export class AuctionItem {
  itemName: string;
  itemGrade: string;
  itemQuality?: number;
  options: AuctionItemOption[];
  buyPrice: number;
}

export class AuctionItemOption {
  optionName: string;
  tripod: string;
  value: number;
  isPenalty: boolean;
  className: string;
}
