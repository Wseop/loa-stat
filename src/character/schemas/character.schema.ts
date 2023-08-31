import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

///////////////
// Engraving //
///////////////
@Schema({ _id: false, versionKey: false })
export class Engraving {
  @Prop()
  name: string;

  @Prop()
  level: number;
}
export const EngravingSchema = SchemaFactory.createForClass(Engraving);

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
export const RuneSchema = SchemaFactory.createForClass(Rune);

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
  gem?: string[];
}
export const SkillSchema = SchemaFactory.createForClass(Skill);

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

  @Prop()
  stat: string;

  @Prop()
  set: string;

  @Prop({ type: [EngravingSchema] })
  engravings: Engraving[];

  @Prop()
  elixir: string;

  @Prop({ type: [SkillSchema] })
  skills: Skill[];
}
export const CharacterSchema = SchemaFactory.createForClass(Character);
