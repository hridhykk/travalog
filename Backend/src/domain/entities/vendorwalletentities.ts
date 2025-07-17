import mongoose from "mongoose";

export interface IVendorWallet {
  _id?: string;
  vendorId:mongoose.Types.ObjectId | string;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}
