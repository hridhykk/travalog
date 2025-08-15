
import mongoose from "mongoose";

export interface IReview {
  userId:  mongoose.Types.ObjectId | string; 
  packageId:mongoose.Types.ObjectId | string;          
  vendorId:mongoose.Types.ObjectId | string;           
  rating: number;  
  images?: string[];          
  comment: string;          
  createdAt?: Date;           
  updatedAt?: Date;          
}
