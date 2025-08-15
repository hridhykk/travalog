import { IReview } from "../../entities/reviewentities";

export interface IReviewRepository{
  create(review:IReview):Promise<IReview | null>
  findByPackageId(packageId: string): Promise<IReview[]>;
  findByUserId(userId: string): Promise<IReview[]>;
  findByVendorId(vendorId: string): Promise<IReview[]>;
  fetchAllReviews(): Promise<IReview[]>;
}