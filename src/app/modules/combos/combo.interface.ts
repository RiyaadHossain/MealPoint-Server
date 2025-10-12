import { MenuSize } from "@/enums/menu.enum.js";
import { Types } from "mongoose";

export interface IComboItem {
  item: Types.ObjectId; // Reference to menu item
  hasVariants: boolean;
  quantity: number;
  price: number;
  size: MenuSize
}

export interface ICombo {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  totalSold: number;
  image: string;
  items: IComboItem[];
  isAvailable: boolean;
  estimatedTime: string;
}
