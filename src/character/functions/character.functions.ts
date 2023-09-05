import { classEngravingMap } from 'src/lostark/resources/const';
import { Character, Setting, Skill } from '../schemas/character.schema';

export type Profile = Omit<Character, 'skills' | 'setting' | 'classEngraving'>;

export function CharacterBuilder(
  profile: Profile,
  setting: Setting,
  skills: Skill[],
): Character {
  if (profile && setting && skills?.length > 0) {
    let classEngraving = null;

    if (setting?.engravings) {
      for (let engraving of setting.engravings) {
        if (classEngravingMap[engraving.name]) {
          classEngraving = engraving.name;
          break;
        }
      }
    }

    if (classEngraving) {
      return {
        characterName: profile.characterName,
        serverName: profile.serverName,
        className: profile.className,
        itemLevel: profile.itemLevel,
        classEngraving,
        setting,
        skills,
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
}
