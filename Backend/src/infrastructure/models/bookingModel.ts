// src/infrastructure/models/BookingModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IBooking } from '../../domain/entities/bookingentities';

const BookingSchema: Schema = new Schema<IBooking>(
  {
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },

    amount: { type: Number, required: true },
    numPeople: { type: Number, required: true },
    packageId:{ type: String, required: true },
    packageName: { type: String, required: true },
    paymentStatus: { type: String, enum: [ 'successful', 'failed','canceled'], default: 'successful' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    cancelled:{type:Boolean,default:false},
    bookedDate: { type: String, required: true }, 
       isAmountReleased: { type: Boolean, default: false }// The booked date (ISO string)
  },
  { timestamps: true }
);

const BookingModel = mongoose.model<IBooking & Document>('Booking', BookingSchema);

export { BookingModel };
