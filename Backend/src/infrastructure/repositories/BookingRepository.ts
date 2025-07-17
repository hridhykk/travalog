// src/application/usecases/BookingUseCase.ts
import { IBookingRepository } from "../../domain/interfaces/repositories/iBookingRepository";
import { IBooking } from "../../domain/entities/bookingentities";
import { BookingModel } from "../models/bookingModel";
import { PackageModel } from "../models/packageModel";
import { UserModel } from "../models/userModel";

export class BookingRepository implements IBookingRepository {


  async create(bookingData: IBooking): Promise<IBooking> {
    try {
      return await BookingModel.create(bookingData);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async findAllBookings(): Promise<IBooking[]> {
    try {
      return await BookingModel.find().lean();
    } catch (error) {
      console.error('Error finding all bookings:', error);
      throw error;
    }
  }

  async findByOrderId(orderId: string): Promise<IBooking | null> {
    try {
      return await BookingModel.findOne({ orderId }).lean();
    } catch (error) {
      console.error(`Error finding booking by orderId (${orderId}):`, error);
      throw error;
    }
  }


  async findByuserId(userId: string): Promise<IBooking[] | null> {
    try {
    const userIdStr = userId.toString();
    
  return await BookingModel.find({ userId: userIdStr }).lean();
  

    } catch (error) {
      console.error(`Error finding bookings by userId (${userId}):`, error);
      throw error;
    }
  }

  // async blockBooking(orderId: string): Promise<IBooking> {
  //   return BookingModel.findOneAndUpdate(
  //     { orderId },
  //     { isBlocked: true },
  //     { new: true }
  //   ).lean();
  // }

  // async unblockBooking(orderId: string): Promise<IBooking> {
  //   return BookingModel.findOneAndUpdate(
  //     { orderId },
  //     { isBlocked: false },
  //     { new: true }
  //   ).lean();
  // }

async FindBookings(vendorId: string, page: number, limit: number): Promise<{ bookings: any[]; totalCount: number }> {
  try {
    const skip = (page - 1) * limit;

    // Step 1: Get all packages for the vendor
    const packages = await PackageModel.find({ vendorId }, '_id').lean();
    const packageIds = packages.map(pkg => pkg._id.toString());

    if (packageIds.length === 0) {
      return { bookings: [], totalCount: 0 };
    }

    // Step 2: Get total count (before pagination)
    const totalCount = await BookingModel.countDocuments({ packageId: { $in: packageIds } });

    // Step 3: Aggregate bookings with user details and apply pagination
 const bookingsWithUser = await BookingModel.aggregate([
  { $match: { packageId: { $in: packageIds } } },
  {
    $addFields: { 
      userObjectId: { $toObjectId: '$userId' } // 👈 convert string to ObjectId
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'userObjectId', // 👈 use converted field
      foreignField: '_id',
      as: 'userDetails'
    }
  },
  { $unwind: '$userDetails' },
  {
    $project: {
      orderId: 1,
      paymentId: 1,
      userId: 1,
      amount: 1,
      numPeople: 1,
      packageId: 1,
      packageName: 1,
      paymentStatus: 1,
      isVerified: 1,
      isBlocked: 1,
      bookedDate: 1,
      createdAt: 1,
      updatedAt: 1,
      userName: '$userDetails.name',
      userEmail: '$userDetails.email',
      userMobile: '$userDetails.mobile'
    }
  },
  { $skip: skip },
  { $limit: limit }
]);
console.log(bookingsWithUser)
    return { bookings: bookingsWithUser, totalCount };
  } catch (error) {
    console.error('Error finding bookings with user details for vendor:', error);
    throw error;
  }
}

async cancelBooking(bookingId: string): Promise<IBooking | null> {
  try {
  //  const orderId = bookingId;

    const updatedBooking = await BookingModel.findOneAndUpdate(
      { orderId:bookingId }, 
      { $set: { cancelled: true } },
      { new: true } 
    ).lean();

    console.log("updatedBooking", updatedBooking);
    return updatedBooking;

  } catch (error) {
    console.error(`Error cancelling booking with ID (${bookingId}):`, error);
    throw error;
  }
}


}
