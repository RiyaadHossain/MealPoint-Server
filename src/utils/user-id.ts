import { User } from "@/app/modules/users/user.model.js";
import { UserRole } from "@/enums/user.enum.js";

export const generateUserId = async (
  role: UserRole = UserRole.CUSTOMER
): Promise<string> => {
  // Find the latest user by id in descending order
  const latestUser = await User.findOne({ id: /^C-\d{5}$/, role })
    .sort({ id: -1 })
    .select("id")
    .lean();

  let nextNumber = 1;
  if (latestUser && latestUser.id) {
    const match = latestUser.id.match(/^C-(\d{5})$/);
    if (match) {
      nextNumber = parseInt(match[1] || "0", 10) + 1;
    }
  }

  const nextId = `${role === UserRole.CUSTOMER ? "C" : "A"}-${nextNumber
    .toString()
    .padStart(5, "0")}`;
  return nextId;
};
