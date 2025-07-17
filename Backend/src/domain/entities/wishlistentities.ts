import mongoose from "mongoose";

export interface IWishlist {
  userId: mongoose.Schema.Types.ObjectId;
  packageIds: mongoose.Schema.Types.ObjectId[];  
}