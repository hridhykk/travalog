import { IPackageRepository } from "../../../domain/interfaces/repositories/iPackageRepository";
import { IPackage } from "../../../domain/entities/packageentities";

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