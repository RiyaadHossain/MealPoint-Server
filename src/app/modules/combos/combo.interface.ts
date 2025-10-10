import { Types } from "mongoose";

export interface IComboItem {
  item: Types.ObjectId; // Reference to menu item
  quantity: number;
  price: number;
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
