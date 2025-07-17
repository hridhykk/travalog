// walletModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IWallet,IWalletTransaction } from '../../domain/entities/walletentities';

const WalletTransactionSchema: Schema = new Schema<IWalletTransaction>(
  {
    transfertype: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: () => new Date() },
    description: { type: String, required: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success' },
  },
  { _id: true }
);

const WalletSchema: Schema = new Schema<IWallet>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, required: true, default: 0 },
    transactions: [WalletTransactionSchema],
  },
  { timestamps: true }
);

const WalletModel = mongoose.model<IWallet>('Wallet', WalletSchema);
export { WalletModel };
