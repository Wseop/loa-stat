import { ClassEngravingMap } from 'src/commons/consts/lostark.const';
import { Character, Setting, Skill } from '../schemas/character.schema';

export type Profile = Omit<Character, 'skills' | 'setting' | 'classEngraving'>;

export const CharacterBuilder = (
  profile: Profile,
  setting: Setting,
  skills: Skill[],
): Character => {
  if (profile && setting && skills) {
    let classEngraving = null;

    if (setting?.engravings) {
      for (let engraving of setting.engravings) {
        if (ClassEngravingMap[engraving.name]) {
          classEngraving = engraving.name;
          break;
        }
      }
    }

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
};

export const ValidateCharacter = (character: Character): boolean => {
  for (let key in character) {
    if (!character[key]) return false;
  }
  for (let key in character.setting) {
    if (!character.setting[key]) return false;
  }
  if (character.skills.length <= 0) return false;
  return true;
};
