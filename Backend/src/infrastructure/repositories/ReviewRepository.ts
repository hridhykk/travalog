import { IReview } from "../../domain/entities/reviewentities";
import { ReviewModel } from "../models/reviewModel";
import { IReviewRepository } from "../../domain/interfaces/repositories/iReviewRepository";

export class ReviewRepository implements IReviewRepository{
async create (review:IReview):Promise<IReview>{
  return ReviewModel.create(review)
}
async findByPackageId(packageId: string): Promise<IReview[]> {
  return ReviewModel.find({ packageId });
}
async findByUserId(userId: string): Promise<IReview[]> {
  return ReviewModel.find({ userId });
}
async findByVendorId(vendorId: string): Promise<IReview[]> {
  return ReviewModel.find({ vendorId });
}
async fetchAllReviews(): Promise<IReview[]> {
  return ReviewModel.find().lean();
}
}