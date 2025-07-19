import { Request,Response,NextFunction } from "express";
const Razorpay = require("razorpay");
import { BookingRepository } from "../../../infrastructure/repositories/BookingRepository";
import { PackageRepository } from "../../../infrastructure/repositories/PackageRepository";
import { IBooking } from "../../../domain/entities/bookingentities";
import { BookingUseCase } from "../../../application/use-case/user/bookings";
console.log("RZP KEY:", process.env.RAZORPAY_KEY_ID);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

import { AdminWalletRepository } from "../../../infrastructure/repositories/AdminWalletRepository";


export class UserTripController{
private bookingUseCase :BookingUseCase 
  constructor(){
  const bookingRepository = new BookingRepository();
  const packageRepository = new PackageRepository();
  const adminWalletRepo = new  AdminWalletRepository ();
  this.bookingUseCase = new BookingUseCase (bookingRepository,packageRepository,adminWalletRepo)
  }

  createorder = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    const { amount,packageId,userId, date, numPeople, packageName } = req.body;
    
  try {
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { userId,packageId, date, numPeople, packageName },
    });

    res.json({
      id: order.id,
      amount: order.amount,
    });
    }catch(error){
      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
    }

  }

  createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId, paymentId,userId, amount, numPeople, packageId, packageName, bookedDate } = req.body;
const convertedAmount: string = (Number(amount) / 100).toString();

      const result = await this.bookingUseCase.execute(
        orderId,
        paymentId,
        userId,
        convertedAmount,
        numPeople,
        packageId,
        packageName,
        bookedDate
      );
  console.log(result)
      res.status(200).json({
        status: result.status,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
    }
  };
  


}