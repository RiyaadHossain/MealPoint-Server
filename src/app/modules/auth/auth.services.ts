import type { IUser } from "../users/user.interface.js";
import { User } from "../users/user.model.js";
import bcrypt from "bcrypt";
import type { ILoginCridential } from "./auth.interface.js";
import config from "@/config/index.js";
import { jwtHelpers } from "@/helper/jwtHelper.js";
import { generateUserId } from "@/utils/user-id.js";

const register = async (userData: IUser) => {
  const { email } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Generate a unique user ID
  userData.id = await generateUserId();

  const user = await User.create(userData);

  return user;
};

const login = async (credential: ILoginCridential) => {
  const user = await User.findOne({ email: credential.email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare the provided password with the stored hashed password
  console.log(credential.password, user.password);
  const isMatch = await bcrypt.compare(credential.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }


  const { id, role } = user;
  const token = jwtHelpers.createToken(
    { id, role },
    config.JWT_SECRET,
    config.JWT_EXPIRATION
  );

  return { user, token };
};

export const AuthService = {
  register,
  login,
};
