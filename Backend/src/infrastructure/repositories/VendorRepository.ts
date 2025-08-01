import { IVendorRepository } from "../../domain/interfaces/repositories/iVendorRepository";
import { IVendor } from "../../domain/entities/vendorentities";
import { VendorModel } from "../models/vendorModel";
import moment from "moment";


export class VendorRepository implements IVendorRepository{
  async FindByEmail(email: string): Promise<IVendor | null> {
      return VendorModel.findOne({email})
  }
  async FindById(Id: string): Promise<IVendor | null> {
    return VendorModel.findOne({ _id:Id });
}
  async create(user:IVendor):Promise<IVendor>{
return VendorModel.create(user)
  }
  async findAllVendors(): Promise<IVendor[]> {
    return VendorModel.find().lean();  
  }

  async updateVendor(vendorId: string, userData: { name: string; is_blocked: boolean }): Promise<IVendor | null> {
    try {
      const updatedUser = await VendorModel.findOneAndUpdate(
        { _id: vendorId },
        {
          $set: {
            name: userData.name,
            is_blocked: userData.is_blocked
          }
        },
        { 
          new: true,
          runValidators: true 
        }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  async updateVendorVerification(vendorId: string, is_Verified: boolean): Promise<{ status: string; message: string; vendor?: IVendor }> {
    try {
      const updatedVendor = await VendorModel.findOneAndUpdate(
        { _id: vendorId },
        {
          $set: {
            is_Verified: is_Verified
          }
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!updatedVendor) {
        return {
          status: "error",
          message: "Vendor not found"
        };
      }

      return {
        status: "success",
        message: "Vendor verification updated successfully",
        vendor: updatedVendor
      };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      };
    }
  }

  async updatePasswordByEmail(email: string, newPassword: string): Promise<IVendor| null> {
    try {
      const updatedUser = await VendorModel.findOneAndUpdate(
        { email },
        {
          $set: {
            password: newPassword
          }
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }


  async updateVendorDetails(vendorId: string, updatedData: Partial<IVendor>): Promise<IVendor | null> {
    try {
      const updatedVendor = await VendorModel.findOneAndUpdate(
        { _id: vendorId },
        {
          $set: updatedData,
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Run schema validators
        }
      );

      if (!updatedVendor) {
        throw new Error("Vendor not found");
      }

      return updatedVendor;
    } catch (error) {
      console.error("Error updating vendor details:", error);
      throw error;
    }
  }


  async getVendorCount(range: "daily" | "weekly" | "monthly" | "yearly" | "all"): Promise<number> {
    console.log("Range in getVendorCount:2222222", range);
    if (range === "all") {
      return await VendorModel.countDocuments({});
    }

    const { start, end } = this.getDateRange(range);

    return await VendorModel.countDocuments({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });
  }


private getDateRange(range: "daily" | "weekly" | "monthly" | "yearly") {
    const now = moment();
    let start: moment.Moment;

    switch (range) {
      case "daily":
        start = now.clone().startOf("day");
        break;
      case "weekly":
        start = now.clone().startOf("week");
        break;
      case "monthly":
        start = now.clone().startOf("month");
        break;
      case "yearly":
        start = now.clone().startOf("year");
        break;
      default:
        start = now.clone().startOf("day");
    }

    return { start: start.toDate(), end: now.toDate() };
  }

}