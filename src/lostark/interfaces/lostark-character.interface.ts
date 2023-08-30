export class Engraving {
  name: string;
  level: number;
}

export class Profile {
  characterName: string;
  serverName: string;
  className: string;
  classEngraving: string;
  itemLevel: number;
  stat: string;
  set: string;
  engravings: Engraving[];
  elixir: string;
}

export class Character {
  profile: Profile;
}
