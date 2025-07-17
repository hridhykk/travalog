
import mongoose, { Schema, Document } from 'mongoose';
import { IVendorWallet } from '../../domain/entities/vendorwalletentities';

const VendorWalletSchema:Schema = new Schema<IVendorWallet>(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    balance: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const VendorWalletModel = mongoose.model<IVendorWallet & Document>('VendorWallet', VendorWalletSchema);

export { VendorWalletModel };
