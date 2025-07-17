
import mongoose from "mongoose";

export interface IReview {
  userId:  mongoose.Types.ObjectId | string; 
  packageId: string;          
  vendorId: string;           
  rating: number;             
  comment: string;          
  createdAt?: Date;           
  updatedAt?: Date;          
}
