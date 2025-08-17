import { UserRole, UserLevel } from "@/enums/user.enum.js";
import { Document, Model } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  role: UserRole;
  level: UserLevel;
  loyaltyPoints: number;
  targetPoints: number;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserModel extends Model<IUser> {
  findUserByEmail(email: string): Promise<boolean>;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}