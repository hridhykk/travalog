import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from '../../domain/entities/Transactionentitites';

const TransactionSchema: Schema = new Schema<ITransaction>(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    type: { type: String, enum: ['admin_cut', 'vendor_payout'], required: true },
    amount: { type: Number, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model<ITransaction & Document>('Transaction', TransactionSchema);

export { TransactionModel };
