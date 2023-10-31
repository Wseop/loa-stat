export interface TripodSearchOption {
  skillId: number;
  skillName: string;
  tripodId: number;
  tripodName: string;
}

export interface TripodPrice {
  skillName: string;
  tripodName: string;
  iconPath?: string;
  price: number;
  updated: string;
}
