import { User } from "../users/user.model.js";

export const getAdminsId = async () => {
  return await User.find({ role: "admin" }, { id: 1 }).then((admins) => {
    return admins.map((admin) => admin._id as string);
  });
};