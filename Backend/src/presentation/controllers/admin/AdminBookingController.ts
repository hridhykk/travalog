import { Request, Response } from "express";
import { FetchBookedDetailsUseCase } from "../../../application/use-case/admin/BookingUseCase";
import { IBookingRepository } from "../../../domain/interfaces/repositories/iBookingRepository";
import { BookingRepository } from "../../../infrastructure/repositories/BookingRepository";


export class BookingController {
  private fetchBookedDetailsUseCase: FetchBookedDetailsUseCase
  constructor() {
const iBookingRepository = new BookingRepository()
this.fetchBookedDetailsUseCase = new FetchBookedDetailsUseCase(iBookingRepository)
  }

  fetchBookedDetails=async (req: Request, res: Response): Promise<void>=> {
    try {
      const result = await this.fetchBookedDetailsUseCase.execute();

      if (result.status === "failed") {
         res.status(404).json({
          status: result.status,
          message: result.message,
        });
      }

      if (result.status === "error") {
        res.status(500).json({
          status: result.status,
          message: result.message,
        });
      }

      res.status(200).json({
        status: result.status,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("Error in fetchBookedDetails controller:", error);
     res.status(500).json({
        status: "error",
        message: "An unexpected error occurred",
      });
    }
  }
}
