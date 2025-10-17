// Review interface
export interface IReview {
  menuId?: string;
  comboId?: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
}
