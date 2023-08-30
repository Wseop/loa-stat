export class Character {
  profile: Profile;
  skills: Skill[];
}

/////////////
// PROFILE //
/////////////
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

export class Engraving {
  name: string;
  level: number;
}

///////////
// SKILL //
///////////
export class Skill {
  name: string;
  level: number;
  tripods: string[];
  rune?: Rune;
  gem?: string[];
}

export class Rune {
  name: string;
  grade: string;
}
