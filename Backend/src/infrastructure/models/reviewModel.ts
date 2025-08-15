import mongoose, { Schema } from "mongoose";
import { IReview } from "../../domain/entities/reviewentities";

const ReviewSchema: Schema = new Schema<IReview>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
   images: { type: [String], required: true },
}, { timestamps: true });


export const ReviewModel = mongoose.model<IReview>('Review',ReviewSchema)