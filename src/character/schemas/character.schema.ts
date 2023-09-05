import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/////////////
// Setting //
/////////////
@Schema({ _id: false, versionKey: false })
export class Engraving {
  @Prop()
  name: string;

  @Prop()
  level: number;
}
const EngravingSchema = SchemaFactory.createForClass(Engraving);

@Schema({ _id: false, versionKey: false })
export class Setting {
  @Prop()
  stat: string;

  @Prop()
  set: string;

  @Prop()
  elixir: string;

  @Prop({ type: [EngravingSchema] })
  engravings: Engraving[];
}
const SettingSchema = SchemaFactory.createForClass(Setting);

///////////
// SKILL //
///////////
@Schema({ _id: false, versionKey: false })
export class Rune {
  @Prop()
  name: string;

  @Prop()
  grade: string;
}
const RuneSchema = SchemaFactory.createForClass(Rune);

@Schema({ _id: false, versionKey: false })
export class Skill {
  @Prop()
  name: string;

  @Prop()
  level: number;

  @Prop({ type: [String] })
  tripods: string[];

  @Prop({ type: RuneSchema })
  rune?: Rune;

  @Prop({ type: [String] })
  gems: string[];
}
const SkillSchema = SchemaFactory.createForClass(Skill);

///////////////
// CHARACTER //
///////////////
@Schema({ timestamps: {}, versionKey: false })
export class Character {
  @Prop()
  characterName: string;

  @Prop()
  serverName: string;

  @Prop()
  className: string;

  @Prop()
  classEngraving: string;

  @Prop()
  itemLevel: number;

  @Prop({ type: SettingSchema })
  setting: Setting;

  @Prop({ type: [SkillSchema] })
  skills: Skill[];
}
export const CharacterSchema = SchemaFactory.createForClass(Character);
