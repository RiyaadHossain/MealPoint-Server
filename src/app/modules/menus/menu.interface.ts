import type { MenuLabel, MenuSize } from "@/enums/menu.enum.js";
import { Types } from "mongoose";

type IPrice = { [key in MenuSize]: number };

export interface IMenu {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: IPrice;
  category: Types.ObjectId;
  // size: MenuSize; // Removed as price now supports multiple sizes
  tags: string[];
  image: string;
  available: boolean;
  totalSold: number;
  label: MenuLabel;
  estimatedTime: number;
}

export interface MenuQuery {
  startPrice?: number;
  endPrice?: number;
  category?: string;
}

export interface IMenuFilterOptoins {
  searchTerm?: string;
  startPrice?: number;
  endPrice?: number;
  category?: string;
}
