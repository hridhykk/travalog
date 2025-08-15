import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import {
  FetchUserUseCase,
  FetchBookingdetailsUseCase,
  CancelBookingUseCase,
  UserReviewUseCase
} from "../../../application/use-case/user/userAccountUseCase";
import { BookingRepository } from "../../../infrastructure/repositories/BookingRepository";
import { IReview } from "../../../domain/entities/reviewentities";
import { ReviewRepository } from "../../../infrastructure/repositories/ReviewRepository";
import { AdminWalletRepository } from "../../../infrastructure/repositories/AdminWalletRepository";
import { WalletRepository } from "../../../infrastructure/repositories/WalletRepository";

export class UserAccountController {
  private fetchUserUseCase: FetchUserUseCase;
  private fetchBookingdetailsUseCase: FetchBookingdetailsUseCase;
  private cancelBookingUseCase: CancelBookingUseCase;
  private  userReviewUseCase : UserReviewUseCase
  
  constructor() {
    const userRepository = new UserRepository();
    const reviewRepository = new ReviewRepository()
    const bookingRepository = new BookingRepository();
    const walletRepository = new WalletRepository();
    const adminWalletRepository = new AdminWalletRepository();
    this.fetchUserUseCase = new FetchUserUseCase(userRepository);
    this.fetchBookingdetailsUseCase = new FetchBookingdetailsUseCase(
      bookingRepository
    );
    this.cancelBookingUseCase = new CancelBookingUseCase(bookingRepository, adminWalletRepository,walletRepository);
    this.userReviewUseCase = new UserReviewUseCase(reviewRepository);
  }

  fetchUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.query.id as string;
      console.log(id);
      const result = await this.fetchUserUseCase.execute(id);
      res.status(200).json({
        status: result.status,
        message: result.message,
        data: result?.data,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  fetchbookingdetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.query.userId as string;
      const result = await this.fetchBookingdetailsUseCase.execute(userId);
      res.status(200).json({
        status: result.status,
        message: result.message,
        data: result?.data,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };


  CancelBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const bookingId = req.query.orderId as string;
console.log("orderid",bookingId)
      const result = await this.cancelBookingUseCase.execute(bookingId);
      res.status(200).json({
        status: result.status,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };


userReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req.body);

    
    const review: IReview = {
      userId: req.body.userId as string,
      packageId: req.body.packageId as string,
      vendorId: req.body.vendorId as string,
      rating: Number(req.body.rating),
      comment: req.body.comment as string,
     images: Array.isArray(req.body.images) ? req.body.images : [],

    };

    console.log("Parsed Review:", review);

    const result = await this.userReviewUseCase.execute(review);
    console.log("Review Use Case Result:", result);
      res.status(200).json({
        status: result.status,
        message: result.message,
        review:result?.review
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

}
