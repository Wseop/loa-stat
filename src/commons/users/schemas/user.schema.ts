import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: {}, versionKey: false })
export class User {
  @Prop()
  email: string;

  @Prop()
  name: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
