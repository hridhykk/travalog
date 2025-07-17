  import mongoose from "mongoose";

  export interface ITransaction {
    _id?: string;
    bookingId: mongoose.Types.ObjectId | string;
    type: 'admin_cut' | 'vendor_payout';
    amount: number;
    from: string;
    to: string;
    status: 'success' | 'failed';
    createdAt: Date;
    updatedAt?: Date;
  }

