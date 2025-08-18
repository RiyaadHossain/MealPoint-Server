import { Menu } from "@/app/modules/menus/menu.model.js";

export const generateMenuId = async (): Promise<string> => {
  const lastMenu = await Menu.findOne({ id: /^m\d+$/ })
    .sort({ id: -1 })
    .select("id")
    .lean();

  let nextNumber = 101;
  if (lastMenu && lastMenu.id) {
    const match = lastMenu.id.match(/^m(\d+)$/);
    if (match && match[1]) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `M-${nextNumber}`;
};
