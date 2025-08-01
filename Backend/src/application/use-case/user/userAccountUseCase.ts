import { Request, Response } from 'express';
import { IUserRepository } from "../../../domain/interfaces/repositories/iuserRepository";
//import { IBooking } from '../../../domain/entities/bookingentities';
import { IBookingRepository } from "../../../domain/interfaces/repositories/iBookingRepository";
import { IReviewRepository } from '../../../domain/interfaces/repositories/iReviewRepository';
import { ReviewRepository } from '../../../infrastructure/repositories/ReviewRepository';
import { IReview } from '../../../domain/entities/reviewentities';
import { IWalletRepository } from '../../../domain/interfaces/repositories/iWalletRepository';
import { IAdminWalletRepository } from '../../../domain/interfaces/repositories/IAdminWalletRepository';


export class FetchUserUseCase{
  constructor(private userRepository: IUserRepository) {}
  async execute(id:string):Promise<{status:string,message:string,data?:any}>{
   
    const User = await this.userRepository.FindById(id);
    // if(User!){
    //   return {
    //     status:'failed',
    //     message:'user not found'

    //   }
    // }
console.log(User)
    return{
      status:'success',
      message:'user found successfully',
      data:User
    }

  }
}


export class FetchBookingdetailsUseCase{
  constructor(private  bookingRepository:  IBookingRepository) {}
  async execute(userId:string):Promise<{status:string,message:string;data?:any}>{
    
    const bookings = await this.bookingRepository.findByuserId(userId);
    
    return {
      status:'success',
      message:'fetch booking details successfully',
      data:bookings
    }
  }
}



export class CancelBookingUseCase {
  constructor(
    private bookingRepository: IBookingRepository,
    private adminWalletRepository: IAdminWalletRepository,
    private walletRepository: IWalletRepository 
  ) {}

  async execute(bookingId: string): Promise<{ status: string; message: string }> {
    console.log("Cancel booking for:", bookingId);

    // Cancel the booking and retrieve the canceled booking details
    const canceledBooking = await this.bookingRepository.cancelBooking(bookingId);

    if (!canceledBooking || !canceledBooking.amount) {
      throw new Error("Invalid booking or missing amount");
    }

    const amountToDeduct = canceledBooking.amount;
const amountToRefund = canceledBooking.amount;
const userId = String(canceledBooking.userId);
    // Deduct the amount from admin wallet (subtract)
    await this.adminWalletRepository.updateWalletAmount(-amountToDeduct);
  await this.walletRepository.creditAmountToUser(
      String(canceledBooking.userId),
      amountToRefund,
      `Booking cancellation for ${bookingId}`
    );
    return {
      status: "success",
      message: "Order canceled successfully",
    };
  }
}


export class FetchUserWalletUseCase {
  constructor(private walletRepository: IWalletRepository) {}

  async execute(userId: string): Promise<{ status: string; message: string; data?: any }> {
    const wallet = await this.walletRepository.findWalletByUserId(userId);

    if (!wallet) {
      return {
        status: 'failed',
        message: 'Wallet not found',
      };
    }

    return {
      status: 'success',
      message: 'Wallet fetched successfully',
      data: wallet,
    };
  }
}


export class UserReviewUseCase{
  constructor (private reviewRepository:ReviewRepository){}

  async execute(review:IReview):Promise<{status:string,message:string,review?:IReview}>{
    try{

      const reviewcreated = await this.reviewRepository.create(review);
      return {
        status:'suucess',
        message:'review created successfully',
        review:reviewcreated
      }
    }catch (error) {
      console.error('Error in RegisterPackageUseCase:', error);
      return {
        status: 'error',
        message: 'Failed to add review'
      };
    }
  }
}