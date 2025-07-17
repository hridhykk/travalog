
import { Request,Response,NextFunction } from "express";
import { FetchBookingsUseCase } from "../../../application/use-case/vendor/VendorBookings";
import { BookingRepository } from "../../../infrastructure/repositories/BookingRepository";



export class VendorBookingsController{

  private fetchbookingusecase:FetchBookingsUseCase

  constructor(){
const bookingRepository = new BookingRepository();
this.fetchbookingusecase = new FetchBookingsUseCase(bookingRepository)
  }


  FetchBookings = async(req:Request,res:Response ,next:NextFunction): Promise<void>=>{
try{
  console.log('heyyy1')
const vendorId = req.query.vendorId as string;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
  
      if (!vendorId) {
        res.status(400).json({ status: 'error', message: 'vendorId is required' });
        return;
      }
   console.log(req.body)
    const result = await this.fetchbookingusecase.execute(vendorId,page,limit)
  console.log(result)
  
      res.status(result.status === 'success' ? 200 : 401).json({
        status: result.status,
        message: result.message,
        Bookings: result.status === 'success' ? result.data: undefined,
        tottalCount: result.status === 'success' ? result.totalCount: undefined,
       
      });


} catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
    }
  }

}


