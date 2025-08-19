// Review interface
export interface IReview {
  orderId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
}
