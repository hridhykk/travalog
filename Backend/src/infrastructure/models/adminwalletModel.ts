import mongoose, { Schema, Document } from 'mongoose';
import { IAdminWallet } from '../../domain/entities/adminwalletentities';

const AdminWalletSchema: Schema = new Schema<IAdminWallet>(
  {
    totalAmount: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const AdminWalletModel = mongoose.model<IAdminWallet & Document>('AdminWallet', AdminWalletSchema);

export { AdminWalletModel };
