import mongoose from "mongoose";

export interface IWalletTransaction {
  _id?: string;
  transfertype: "credit" | "debit";
  amount: number;
  date?: Date; 
  description?: string;
  status: "success" | "failed" | "pending";
}

export interface IWallet {
  _id?: string;
   userId: mongoose.Types.ObjectId | string;
  balance: number;
  transactions: IWalletTransaction[];
  createdAt?: Date;
  updatedAt?: Date;
}
