import { IReview } from "../../domain/entities/reviewentities";
import { ReviewModel } from "../models/reviewModel";
import { IReviewRepository } from "../../domain/interfaces/repositories/iReviewRepository";

export class ReviewRepository implements IReviewRepository{
async create (review:IReview):Promise<IReview>{
  return ReviewModel.create(review)
}
}