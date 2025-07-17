import { IReview } from "../../entities/reviewentities";

export interface IReviewRepository{
  create(review:IReview):Promise<IReview | null>
}