import mongoose from "mongoose";

export interface IBooking {
  _id?: string;
  orderId: string; 
 userId: mongoose.Types.ObjectId | string;
 vendorId?: mongoose.Types.ObjectId| string;
  paymentId: string; 
  amount: number; 
  bookedDate: string;  
  numPeople: number; 
  packageId: string; 
  packageName: string; 
  cancelled?:boolean,
  paymentStatus?: 'pending' | 'successful' | 'failed'; 
  isVerified?: boolean; 
  isBlocked?: boolean; 
  createdAt?: Date; 
  updatedAt?: Date; 
  isAmountReleased?:boolean;
}
