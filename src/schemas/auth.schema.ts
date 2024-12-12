import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import { UserDocument } from '../userdocument/userDocument.interface';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken?: string; 
}

const userSchema = SchemaFactory.createForClass(User);

userSchema.methods.setRefreshToken = async function (token: string) {
  this.refreshToken = await bcrypt.hash(token, 10);
}

userSchema.methods.isRefreshTokenValid = async function (token: string) {
  return bcrypt.compare(token, this.refreshToken)
}

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
    delete returnedObject.refreshToken;
  },
});

export const UserSchema = userSchema;

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);