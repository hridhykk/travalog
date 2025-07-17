import { Request,Response,NextFunction } from "express";
import { UserHomeUseCase } from "../../../application/use-case/user/userHome";
import { PackageRepository } from "../../../infrastructure/repositories/PackageRepository";

export class UserHomeController {
  private userHomeUseCase: UserHomeUseCase;

  constructor() {
    this.userHomeUseCase = new UserHomeUseCase(new PackageRepository());
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
}