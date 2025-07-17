import cron from 'node-cron';

import { BookingModel } from '../models/bookingModel';
import { PackageModel } from '../models/packageModel';
import { AdminWalletModel } from '../models/adminwalletModel';
import { VendorWalletModel } from '../models/vendorWalletModel';
import { TransactionModel } from '../models/transactionModel';

cron.schedule('*/15 * * * *', async () => {
  const today = new Date();
  console.log(today)
  console.log('Cron job running for booking revenue release...');

  const bookings = await BookingModel.find({
    bookedDate: { $lt: today.toISOString() },
    paymentStatus: 'successful',
    cancelled: false,
    isAmountReleased: { $ne: true }
  });

  for (const booking of bookings) {
    try {
      const packageData = await PackageModel.findById(booking.packageId);
      if (!packageData) continue;

      const vendorId = packageData.vendorId;

      const adminCut = booking.amount * 0.02;
      const vendorAmount = booking.amount - adminCut;
console.log(adminCut)
      // Admin Wallet Update
      await AdminWalletModel.updateOne(
        {},
        {
          $inc: {
            totalAmount: -booking.amount,
            revenue: adminCut
          }
        }
      );

      // Vendor Wallet Update
      await VendorWalletModel.updateOne(
        { vendorId },
        {
          $inc: { balance: vendorAmount },
        },
        { upsert: true }
      );

      // Record Admin Transaction
      await TransactionModel.create({
        bookingId: booking._id,
        type: 'admin_cut',
        amount: adminCut,
        from: booking.userId,
        to: 'admin',
        status: 'success'
      });

      // Record Vendor Transaction
      await TransactionModel.create({
        bookingId: booking._id,
        type: 'vendor_payout',
        amount: vendorAmount,
        from: 'admin',
        to: vendorId,
        status: 'success'
      });

      // Mark booking as released
      await BookingModel.updateOne(
        { _id: booking._id },
        { isAmountReleased: true }
      );

      console.log(`Released for booking ${booking._id}`);
    } catch (error) {
      console.error(`Error processing booking ${booking._id}:`, error);
    }
  }
},
{
  timezone: 'Asia/Kolkata'  // or your preferred timezone
});