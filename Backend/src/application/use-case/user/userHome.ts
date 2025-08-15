import { IPackageRepository } from "../../../domain/interfaces/repositories/iPackageRepository";
import { IPackage } from "../../../domain/entities/packageentities";
import { IReviewRepository } from "../../../domain/interfaces/repositories/iReviewRepository";
import { IReview } from "../../../domain/entities/reviewentities";


export class UserHomeUseCase{
  constructor(private packageRepository: IPackageRepository) {}

  async execute(): Promise<{ status: string; message: string; packages?: IPackage[] }> {
    try {
      const  packages  = await this.packageRepository.findAllPackages();

      if (!packages || packages.length === 0) {
        return {
          status: 'failed',
          message: 'No packages found',
        };
      }

      return {
        status: 'success',
        message: 'Packages fetched successfully',
        packages,
       
      };
    } catch (error) {
      console.error('Error in UserHomeUseCase:', error);
      return {
        status: 'error',
        message: 'Failed to fetch packages',
      };
    }
  }
}


export class FetchAllReviewsUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(): Promise<{ status: string; message: string; data?: IReview[] }> {
    try {
      const reviews = await this.reviewRepository.fetchAllReviews();

      if (!reviews || reviews.length === 0) {
        return {
          status: 'failed',
          message: 'No reviews found',
        };
      }

      return {
        status: 'success',
        message: 'Reviews fetched successfully',
        data: reviews,
      };
    } catch (error) {
      console.error('Error in fetchAllReviewsUseCase:', error);
      return {
        status: 'error',
        message: 'Failed to fetch reviews',
      };
    }
  }
}