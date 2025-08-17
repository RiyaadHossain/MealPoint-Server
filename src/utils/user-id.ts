import { User } from "@/app/modules/users/user.model.js";

export const generateUserId = async (): Promise<string> => {
  // Find the latest user by id in descending order
  const latestUser = await User.findOne({ id: /^C-\d{5}$/ })
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

  const nextId = `C-${nextNumber.toString().padStart(5, "0")}`;
  return nextId;
};
