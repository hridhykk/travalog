
import { error } from "console";
import { IPackage} from '../../../domain/entities/packageentities';
import { IPackageRepository } from '../../../domain/interfaces/repositories/iPackageRepository';

export class BlockPackageUseCase{
  constructor(private packageRepository: IPackageRepository) {}

  async execute(packageId:string,is_blocked: boolean): Promise<{ status: string; message: string }> {
    try{

      const updatedPackage = await this.packageRepository.updateBlockStatus(packageId, is_blocked);

      if (!updatedPackage) {
        return {
          status: "failure",
          message: `Package with ID ${packageId} not found.`,
        };
      }

      return {
        status: "success",
        message: `Package has been ${is_blocked ? "blocked" : "unblocked"} successfully.`,
      };
    } catch (error) {
      console.error("Error in BlockPackageUseCase:", error);
      throw new Error("Failed to update the package status.");
    }
  }


}

export class VerifyPackageUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(packageId: string): Promise<{ status: string; message: string }> {
    try {

      console.log('helooo')
      const updatedPackage = await this.packageRepository.updateField(packageId, {  isVerified: true });

      if (!updatedPackage) {
        return {
          status: "error",
          message: "Failed to verify package. Package not found.",
        };
      }

      return {
        status: "success",
        message: "Package verified successfully",
      };
    } catch (error) {
      console.error("Error in VerifyPackageUseCase:", error);
      throw new Error("Failed to verify the package.");
    }
  }
}

export class FetchPackagesUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(page: number, limit: number, search: string) {
    const { packages, totalCount } = await this.packageRepository.findAllWithPaginationAndSearch(
      page,
      limit,
      search
    );

    return {
      packages,
      totalPages: Math.ceil(totalCount  / limit),
    };
  }
}
