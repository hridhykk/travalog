import { IPackage } from "../../domain/entities/packageentities";
import { PackageModel } from "../models/packageModel";
import { IPackageRepository } from "../../domain/interfaces/repositories/iPackageRepository";

export class PackageRepository implements IPackageRepository {
  async create(packageData: IPackage): Promise<IPackage> {
    return PackageModel.create(packageData);
  }

  async findAllPackages(): Promise<IPackage[]> {
    return PackageModel.find().lean();
  }

  async findById(id: string): Promise<IPackage | null> {
    return PackageModel.findById(id).lean(); // .lean() returns plain object, can return null
  }

  async findByVendorId(vendorId: string): Promise<IPackage[]> {
    return PackageModel.find({ vendorId }).lean();
  }
  async delete(packageId: string):Promise<void>{
     await PackageModel.deleteOne({ _id: packageId });
  }

  async update(packageData: IPackage): Promise<IPackage> {
    const updatedPackage = await PackageModel.findByIdAndUpdate(
      packageData._id,
      packageData,
      { new: true }
    ).lean();
  
    if (!updatedPackage) {
      console.log('faileddd')
      throw new Error("Failed to update the package.");
    }
  
    return updatedPackage;
  }

  async updateBlockStatus(packageId: string, is_blocked: boolean): Promise<IPackage | null> {
    return PackageModel.findByIdAndUpdate(
      packageId,
      { $set: { is_blocked } },
      { new: true }
    ).lean();
  }

  async updateField(packageId: string, updateFields: Partial<IPackage>): Promise<IPackage | null> {
    return PackageModel.findByIdAndUpdate(packageId, updateFields, { new: true }).lean();
  }


  async updatepackages(packageId: string, packageData: Partial<IPackage>): Promise<IPackage | null> {
    try {
      
      const updatedPackage = await PackageModel.findByIdAndUpdate(
        packageId,
        { $set: packageData },  
        { new: true }  
      );
      return updatedPackage;
    } catch (error) {
      console.error("Error in repository:", error);
      throw new Error("Error updating package in database");
    }
  }

  async findByVendorIdWithPagination(
    vendorId: string,
    page: number,
    limit: number
  ): Promise<{ packages: IPackage[]; totalCount: number }> {
    const skip = (page - 1) * limit;
  
    const [packages, totalCount] = await Promise.all([
      PackageModel.find({ vendorId }).skip(skip).limit(limit).lean(), 
      PackageModel.countDocuments({ vendorId }), 
    ]);
  
    return { packages, totalCount };
  }
  
  async findAllWithPaginationAndSearch(
    page: number,
    limit: number,
    searchTerm: string = ""
  ): Promise<{ packages: IPackage[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const query: Record<string, any> = {};

    if (searchTerm) {
      query.packageName = { $regex: searchTerm, $options: "i" }; 
    }

    const [packages, totalCount] = await Promise.all([
      PackageModel.find(query).skip(skip).limit(limit).lean(),
      PackageModel.countDocuments(query),
    ]);

    return { packages, totalCount };
  }
}
