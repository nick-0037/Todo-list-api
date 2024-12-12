import { Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  setRefreshToken(token: string): Promise<void>;
  isRefreshTokenValid(token: string): Promise<Boolean>;
}
