import { Request, Response, NextFunction } from "express";
import { RegisterPackageUseCase, FetchPackageUseCase,UpdateSlotUseCase,FetchAllPackagesUseCase,FetchPackageDetailsUseCase, CheckavailabilityUseCase ,DeletePackageUseCase,UpdatePackageUseCase  } from '../../../application/use-case/vendor/vendorPackage';
import { PackageRepository } from "../../../infrastructure/repositories/PackageRepository";
import { IPackage } from "../../../domain/entities/packageentities";
import path from 'path';
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import cloudinary from "../../../utils/cloudinary";

export class VendorPackageController {
  private registerPackageUseCase: RegisterPackageUseCase;
  private fetchPackageUsecase: FetchPackageUseCase;
private updateSlotUseCase :UpdateSlotUseCase
private fetchAllPackageUseCase :FetchAllPackagesUseCase
private fetchPackageDetailsUseCase:FetchPackageDetailsUseCase
private checkavailabilityUseCase :CheckavailabilityUseCase 
private  deletePackageUseCase: DeletePackageUseCase;
private updatePackageUseCase:UpdatePackageUseCase
  constructor() {
    const packageRepository = new PackageRepository();
    this.registerPackageUseCase = new RegisterPackageUseCase(packageRepository);
    this.fetchPackageUsecase = new FetchPackageUseCase(packageRepository);
    this.updateSlotUseCase = new UpdateSlotUseCase(packageRepository);
    this.fetchAllPackageUseCase = new FetchAllPackagesUseCase(packageRepository)
    this.fetchPackageDetailsUseCase =new FetchPackageDetailsUseCase(packageRepository)
    this.checkavailabilityUseCase  = new CheckavailabilityUseCase (packageRepository);
    this.deletePackageUseCase  = new DeletePackageUseCase (packageRepository)
  this.updatePackageUseCase = new UpdatePackageUseCase(packageRepository)
  }




 registerPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = req.body;
    const uploadedImageUrls: string[] = parsedData.images || [];


    const packageData: IPackage = {
      vendorId: parsedData.vendorId,
      packageName: parsedData.packageName,
      companyName: parsedData.companyName,
      venue: parsedData.venue,
      price: parseFloat(parsedData.price),
      duration: parsedData.duration,
      inclusion: parsedData.inclusion || [],
      exclusion: parsedData.exclusion || [],
      packageDescription: parsedData.packageDescription,
      dayDescriptions: parsedData.dayDescriptions || [],
      maxPersons: parseInt(parsedData.maxPersons),
      minPersons: parseInt(parsedData.minPersons),
      maxDuration: parseInt(parsedData.maxDuration),
      PackageType: parsedData.PackageType,
      maxPackagesPerDay: parsedData.maxPackagesPerDay || 1,
      isBlocked: false,
      isVerified: false,
      images: uploadedImageUrls,
    };

    const result = await this.registerPackageUseCase.execute(packageData);

    if (result.status === 'success') {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Package Registration Error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};




fetchPackagesWithPagination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vendorId = req.query.vendorId as string;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    if (!vendorId) {
      res.status(400).json({ status: 'error', message: 'vendorId is required' });
      return;
    }

    const result = await this.fetchPackageUsecase.execute(vendorId, page, limit);
    const data = result.data;
    const totalCount = result.totalCount ?? 0;

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      status: 'success',
      message: 'Packages fetched successfully',
      data, // Images already include usable Cloudinary URLs
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
  


  updateSlot =async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
 try{

  const { packageId, date, maximumAllowedPackages } = req.body;
console.log(req.body)
      if (!packageId || !date || maximumAllowedPackages === undefined) {
        res.status(400).json({ error: "Missing required fields." });
        return;
      }
console.log(req.body)
      const updatedPackage = await this.updateSlotUseCase.updateSlot(
        packageId,
        date,
        maximumAllowedPackages
      );

      res.status(200).json({ success: true, data: updatedPackage });

 }catch(error){
  console.error('Error fetching packages:', error);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
 }
  }


  fetchallpackages = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{

   console.log('fetch all packages ')
   const result = await this.fetchAllPackageUseCase.execute();

   const packages = result.data;

      
   res.status(result?.status === 'success' ? 200 : 401).json({ 
    status: result?.status,
    message: result?.message,
    data:packages
  });

    }catch(error){
      console.error('Error fetching packages:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }



  fetchpackage=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
   try{

    const id = req.query.id as string;
    // console.log(id);

    const result = await this.fetchPackageDetailsUseCase.execute(id)
    const packageData = result.data; // Assuming this is an array of packages
    

      if (!packageData || packageData.length === 0) {
         res.status(404).json({
          status: "error",
          message: "No packages found for the provided ID.",
        });
      }

      const s3Client = new S3Client({ region: process.env.AWS_REGION });

      // Map through packages to fetch signed URLs for images
      packageData.images = await Promise.all(
        packageData.images.map(async (imageKey: string) => {
          if (imageKey) {
            const command = new GetObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME!,
              Key: `travalog/vendor/uploadimages/${imageKey}`, // Ensure the path matches your S3 structure
            });
            return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
          }
          return null; // Return null for empty image keys
        })
      );
  
      // console.log("Package with Signed URLs:", packageData);
      // Send the final response with resolved image URLs
      res.status(200).json({
        status: "success",
        message: "Package details fetched successfully",
        data: packageData,
      });

    
   }catch(error){

   }
  }

   checkAvailability=async(req: Request, res: Response): Promise<void>=> {
    console.log(req.body)
    const { packageId, date, numPeople } = req.body;

    if (!packageId || !date || !numPeople) {
      res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: packageId, date, and numPeople.',
      });
      return;
    }

    try {
      // Call the use case to check the availability
      const result = await this.checkavailabilityUseCase.execute(packageId, date, numPeople);

      // Send the result back to the frontend
      res.status(200).json({ 
        status: result?.status,
        message: result?.message,
        
      });
    } catch (error) {
      console.error('Error in checkAvailability controller:', error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while checking availability.',
      });
    }
  }




 deletePackage=  async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
     // Assuming package ID is passed in the URL as a parameter
     const packageId = req.query.packageId as string;
console.log('the iddd' ,packageId)
    try {
    const result = await this.deletePackageUseCase.execute(packageId);
    res.status(200).json({
      status:result.status,
      message:result.message
    })
    } catch (error) {
      // Handle unexpected errors
      console.error('Error in deletePackage controller:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }




  updatepackage =async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
    try{

      console.log(req.body)
     
   
      const packageData = req.body;  
      const packageId = packageData._id
      console.log(packageData._id);
      if (!packageId) {
        res.status(400).json({ error: "Package ID is required" });
      }

      
      const updatedPackage = await this.updatePackageUseCase.execute(packageId, packageData);

      if (!updatedPackage) {
        res.status(404).json({ error: "Package not found" });
      }

      res.status(200).json({
        message: "Package updated successfully",
        data: updatedPackage,
      });
    }catch (error) {
      // Handle unexpected errors
      console.error('Error in deletePackage controller:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }
    

}
