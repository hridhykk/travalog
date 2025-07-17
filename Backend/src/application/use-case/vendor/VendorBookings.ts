

import { IBookingRepository } from "../../../domain/interfaces/repositories/iBookingRepository";
import { IBooking } from "../../../domain/entities/bookingentities";

export class FetchBookingsUseCase{
  constructor(private bookingrepository:IBookingRepository) {}

    async execute(vendorId: string, page: number, limit: number): Promise<{ status: string; message: string; data?: any; totalCount?: number }> {
try{

    const {bookings , totalCount } = await this.bookingrepository.FindBookings(vendorId, page, limit);

    console.log(bookings)
if(!bookings&&totalCount){
  return {
    status: 'failed',
    message: 'Packages fetched successfully',
   
  };
}
      return {
        status: 'success',
        message: 'Packages fetched successfully',
        data: bookings,
        totalCount: totalCount || 0,
      };


}catch (error) {
      console.error('Error in FetchPackageUseCase:', error);
      return {
        status: 'error',
        message: 'Failed to fetch packages',
      };
    }
  }
}
