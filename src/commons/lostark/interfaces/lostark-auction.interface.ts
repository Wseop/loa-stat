import { AuctionItemCategory } from 'src/commons/enums/lostark.enum';

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
  iconPath?: string;
}

export interface AuctionItemOption {
  optionName: string;
  tripod: string;
  value: number;
  isPenalty: boolean;
  className: string;
}

export interface APIResultAuctionItem {
  PageNo: number;
  PageSize: number;
  TotalCount: number;
  Items: {
    Name: string;
    Grade: string;
    Tier: number;
    Level: number;
    Icon: string;
    GradeQuality: number;
    AuctionInfo: {
      StartPrice: number;
      BuyPrice: number;
      BidPrice: number;
      EndDate: string;
      BidCount: number;
      BidStartPrice: number;
      IsCompetitive: boolean;
      TradeAllowCount: number;
    };
    Options: {
      Type: string;
      OptionName: string;
      OptionNameTripod: string;
      Value: number;
      IsPenalty: boolean;
      ClassName: string;
    }[];
  }[];
}

export interface APIResultAuctionOption {
  MaxItemLevel: number;
  ItemGradeQualities: number[];
  SkillOptions: {
    Value: number;
    Class: string;
    Text: string;
    IsSkillGroup: boolean;
    Tripods: {
      Value: number;
      Text: string;
      IsGem: boolean;
    }[];
  }[];
  EtcOptions: {
    Value: number;
    Text: string;
    EtcSubs: {
      Value: number;
      Text: string;
      Class: string;
    }[];
  }[];
  Categories: {
    Subs: {
      Code: number;
      CodeName: string;
    }[];
    Code: number;
    CodeName: string;
  }[];
  ItemGrades: string[];
  ItemTiers: number[];
  Classes: string[];
}
