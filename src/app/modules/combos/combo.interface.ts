import { MenuSize } from "@/enums/menu.enum.js";
import { Types } from "mongoose";

export interface IComboItem {
  item: Types.ObjectId; // Reference to menu item
  quantity: number;
  price: number;
  size: MenuSize
}

export interface ICombo {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  totalSold: number;
  image: string;
  items: IComboItem[];
  isAvailable: boolean;
  estimatedTime: string;
}
