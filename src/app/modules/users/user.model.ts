import mongoose, { Schema } from "mongoose";
import { UserRole, UserLevel } from "@/enums/user.enum.js";
import type { IUser, IUserMethods, IUserModel } from "./user.interface.js";
import config from "@/config/index.js";
import bcrypt from "bcrypt";
import { LOYALTY_POINTS } from "@/enums/common.enum.js";

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    profileImage: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    level: {
      type: String,
      enum: Object.values(UserLevel),
      default: UserLevel.BRONZE,
    },
    loyaltyPoints: { type: Number, default: 0 },
    targetPoints: { type: Number, default: LOYALTY_POINTS.BRONZE },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(user.password, config.SALT_ROUNDS);
  }
  next();
});

userSchema.methods["comparePassword"] = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this["password"]);
};

userSchema.statics["findUserByEmail"] = async function (
  email: string
): Promise<boolean> {
  const user = await this.findOne({ email });
  return !!user;
};

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
