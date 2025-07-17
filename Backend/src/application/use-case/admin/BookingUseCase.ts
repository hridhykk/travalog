import { IBookingRepository } from "../../../domain/interfaces/repositories/iBookingRepository";
import { IBooking } from "../../../domain/entities/bookingentities";
import { BookingModel } from "../../../infrastructure/models/bookingModel";

export class FetchBookedDetailsUseCase {
  constructor(private iBookingRepository: IBookingRepository) {}

  async execute(): Promise<{ status: string; message: string; data?: any }> {
    try {
      const details = await this.iBookingRepository.findAllBookings();

      if (!details || details.length === 0) { // Ensure details exist and are not empty
        return {
          status: "failed",
          message: "Booked details not found",
        };
      }

      return {
        status: "success",
        message: "Booked details fetched successfully",
        data: details,
      };
    } catch (error) {
      console.error("Error fetching booked details:", error); // Add error logging
      return {
        status: "error",
        message: "An error occurred while fetching booked details",
      };
    }
  }
}