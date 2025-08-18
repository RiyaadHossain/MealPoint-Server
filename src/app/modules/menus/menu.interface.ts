import type { MenuLabel } from "@/enums/menu.enum.js";
import { Types } from "mongoose";

export interface IMenu {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Types.ObjectId;
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
