import { Combo } from "@/app/modules/combos/combo.model.js";
import { Menu } from "@/app/modules/menus/menu.model.js";

export const generateMenuId = async (): Promise<string> => {
  const lastMenu = await Menu.findOne({ id: /^M-\d+$/ })
    .sort({ id: -1 })
    .select("id")
    .lean();
  
  let nextNumber = 101;
  if (lastMenu && lastMenu.id) {
    const match = lastMenu.id.match(/^M-(\d+)$/);
    if (match && match[1]) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `M-${nextNumber}`;
};

export const generateComboId = async (): Promise<string> => {
  const lastCombo = await Combo.findOne({ id: /^C-\d+$/ })
    .sort({ id: -1 })
    .select("id")
    .lean();

  let nextNumber = 101;
  if (lastCombo && lastCombo.id) {
    const match = lastCombo.id.match(/^C-(\d+)$/);
    if (match && match[1]) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `C-${nextNumber}`;
};
