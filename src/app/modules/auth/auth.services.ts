import type { IUser } from "../users/user.interface.js";
import { User } from "../users/user.model.js";
import bcrypt from "bcrypt";
import type { ILoginCridential } from "./auth.interface.js";
import config from "@/config/index.js";
import { jwtHelpers } from "@/helper/jwtHelper.js";
import { generateUserId } from "@/utils/user-id.js";
import { NotificationService } from "../notifications/notification.services.js";
import { NotificationType } from "@/enums/notification-type.enum.js";
import { NotificationEvents } from "../notifications/notification.constants.js";
import { getAdminsId } from "./auth.utils.js";
import ApiError from "@/errors/ApiError.js";
import httpStatus from "http-status";
import { UserRole } from "@/enums/user.enum.js";

const register = async (userData: IUser) => {
  const role = UserRole.CUSTOMER;
  const { email } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered");

  // Generate a unique user ID
  userData.id = await generateUserId(role);

  const user = await User.create(userData);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found");

  // @ts-ignore
  const userId = user._id.toString();

  // Send Notifications
  await NotificationService.createNotificationForEvent(
    userId,
    NotificationType.USER_EVENT,
    NotificationEvents.USER_FIRST_LOGIN
  );

  const adminsId = await getAdminsId();

  await Promise.all(
    adminsId.map(
      async (adminId) =>
        await NotificationService.createNotificationForEvent(
          adminId,
          NotificationType.ADMIN_EVENT,
          NotificationEvents.USER_NEW_LOGIN
        )
    )
  );

  return user;
};

const login = async (credential: ILoginCridential) => {
  const user = await User.findOne({ email: credential.email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare the provided password with the stored hashed password
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

const socialLogin = async (userData: IUser) => {
  const { email, provider } = userData;
  userData.password = config.SOCIAL_LOGIN_PASSWORD as string;

  let user = await register(userData).catch(() => null);

  if (!user) {
    user = await User.findOne({ email, provider });
    if (!user) throw new Error("User not found. Please register first.");
  }

  const logInData = await login({
    email,
    password: config.SOCIAL_LOGIN_PASSWORD as string,
  });
  return logInData;
};

const getProfile = async (userId: string) => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error("User not found");
  }
  // Exclude password from returned profile
  const { password, ...profile } = user.toObject();
  return profile;
};

const updateProfile = async (userId: string, updateData: Partial<IUser>) => {
  // Prevent password update through this function
  if (updateData.password) {
    delete updateData.password;
  }

  // check if the user exists
  const existingUser = await User.findOne({ id: userId });
  if (!existingUser) {
    throw new Error("User not found");
  }

  // Update user profile
  const user = await User.findOneAndUpdate({ id: userId }, updateData, {
    new: true,
  });
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...profile } = user.toObject();
  return profile;
};

export const AuthService = {
  register,
  login,
  socialLogin,
  getProfile,
  updateProfile,
};
