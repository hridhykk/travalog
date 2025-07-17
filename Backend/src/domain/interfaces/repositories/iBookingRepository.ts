import { IBooking } from "../../entities/bookingentities";

export interface IBookingRepository {
  create(bookingData: IBooking): Promise<IBooking>;

 findAllBookings(): Promise<IBooking[]>;
 findByOrderId(orderId: string): Promise<IBooking | null>;
 findByuserId(userId: string): Promise<IBooking[] | null>
//  blockBooking(orderId: string): Promise<IBooking>;
//  unblockBooking(orderId: string): Promise<IBooking>;

  FindBookings(vendorId: string, page: number, limit: number): Promise<{ bookings: any[]; totalCount: number }>;
  cancelBooking(bookingId:string):Promise<IBooking|null>;
}