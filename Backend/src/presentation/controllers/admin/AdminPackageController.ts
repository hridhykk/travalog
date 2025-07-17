import { BlockPackageUseCase, VerifyPackageUseCase,FetchPackagesUseCase } from "../../../application/use-case/admin/PackagesUseCase";
import { Request, Response, NextFunction } from "express";

import {PackageRepository} from "../../../infrastructure/repositories/PackageRepository";
import { IPackage } from "../../../domain/entities/packageentities";



export class AdminPackageController{
  private blockPackageUseCase:BlockPackageUseCase
  private  verifyPackageUseCase: VerifyPackageUseCase
  private fetchPackagesUseCase:FetchPackagesUseCase
constructor(){
  const packageRepository = new PackageRepository();
  this.blockPackageUseCase = new BlockPackageUseCase(packageRepository);
  this.verifyPackageUseCase = new  VerifyPackageUseCase(packageRepository);
  this.fetchPackagesUseCase = new FetchPackagesUseCase(packageRepository)
}

fetchallpackages = async(req:Request,res:Response):Promise<void>=>{
  try{
    console.log(req.query)
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit =5// You can change the default limit
    const search = (req.query.search as string) || "";

    const result = await this.fetchPackagesUseCase.execute(page, limit, search);

    res.status(200).json({
    data:result.packages,
    totalPages:result.totalPages
    });
  }catch(error){

  }
}

blockpackage = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try{
    const { packageId } = req.params;
    const { is_blocked } = req.body;

    if (typeof is_blocked !== "boolean") {
     res.status(400).json({ message: "Invalid 'is_blocked' value." });
    }
    const result = await this.blockPackageUseCase.execute(packageId, is_blocked);

    res.status(200).json({
      status: result.status,
      message: result.message,
    });
  }catch(error){

  }
}
verifyPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const packageId = req.query.packageId as string;

console.log(packageId)
    if (!packageId) {
      res.status(400).json({ message: "Package ID is required." });
      return;
    }

    const result = await this.verifyPackageUseCase.execute(packageId);

    res.status(200).json({
      status: result.status,
      message: result.message,
    });
  } catch (error) {
    console.error("Error in verifyPackage controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

}