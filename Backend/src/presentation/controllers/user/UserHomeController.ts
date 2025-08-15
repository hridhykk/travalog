import { Request,Response,NextFunction } from "express";
import { UserHomeUseCase, FetchAllReviewsUseCase } from "../../../application/use-case/user/userHome";
import { PackageRepository } from "../../../infrastructure/repositories/PackageRepository";
import { ReviewRepository } from "../../../infrastructure/repositories/ReviewRepository";

export class UserHomeController {
  private userHomeUseCase: UserHomeUseCase;
  private fetchAllReviewsUseCase: FetchAllReviewsUseCase;


  constructor() {
    const reviewRepository = new ReviewRepository();
    const packageRepository = new PackageRepository();
    this.userHomeUseCase = new UserHomeUseCase(packageRepository);
    this.fetchAllReviewsUseCase = new FetchAllReviewsUseCase(reviewRepository);
  }

  fetchPackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.userHomeUseCase.execute()
      res.status(200).json({
        status: result.status,
        message: result.message,
        packages: result.packages,
      
      });
    } catch (error) {
      console.error('Error fetching packages:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch packages'
      });
    }
  }

fetchAllReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await this.fetchAllReviewsUseCase.execute();
    res.status(200).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch reviews',
    });
  }
}
}