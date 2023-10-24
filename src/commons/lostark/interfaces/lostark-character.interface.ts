export interface APIResultCharacter {
  ArmoryProfile: ArmoryProfile;
  ArmoryEquipment: ArmoryEquipment[];
  ArmoryEngraving: ArmoryEngraving;
  ArmorySkills: ArmorySkill[];
  ArmoryGem: ArmoryGem;
}

export interface ArmoryProfile {
  CharacterImage: string;
  ExpeditionLevel: number;
  PvpGradeName: string;
  TownLevel: number;
  TownName: string;
  Title: string;
  GuildMemberGrade: string;
  GuildName: string;
  UsingSkillPoint: number;
  TotalSkillPoint: number;
  Stats: ProfileStat[];
  Tendencies: {
    Type: string;
    Point: number;
    MaxPoint: number;
  }[];
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: string;
  ItemMaxLevel: string;
}

export interface ProfileStat {
  Type: string;
  Value: string;
  Tooltip: string[];
}

export interface ArmoryEquipment {
  Type: string;
  Name: string;
  Icon: string;
  Grade: string;
  Tooltip: string;
}

export interface ArmoryEngraving {
  Engravings: {
    Slot: number;
    Name: string;
    Icon: string;
    Tooltip: string;
  }[];
  Effects: {
    Name: string;
    Description: string;
  }[];
}

export interface ArmorySkill {
  Name: string;
  Icon: string;
  Level: number;
  Type: string;
  IsAwakening: boolean;
  Tripods: {
    Tier: number;
    Slot: number;
    Name: string;
    Icon: string;
    Level: number;
    IsSelected: boolean;
    Tooltip: string;
  }[];
  Rune: {
    Name: string;
    Icon: string;
    Grade: string;
    Tooltip: string;
  };
  Tooltip: string;
}

export interface ArmoryGem {
  Gems: {
    Slot: number;
    Name: string;
    Icon: string;
    Level: number;
    Grade: string;
    Tooltip: string;
  }[];
  Effects: {
    GemSlot: number;
    Name: string;
    Description: string;
    Icon: string;
    Tooltip: string;
  }[];
}
