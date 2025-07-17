import { WishlistModel } from "../models/wishlistModel";
import { PackageModel } from "../models/packageModel";
import { IWishlistRepository } from "../../domain/interfaces/repositories/iWishlistRepository";
import { IWishlist } from "../../domain/entities/wishlistentities";
import { IPackage } from "../../domain/entities/packageentities";
import mongoose from "mongoose";
export class WishlistRepository implements IWishlistRepository {
  async addToWishlist(userId: string, packageId: string): Promise<IWishlist> {
    const wishlist = await WishlistModel.findOneAndUpdate(
      { userId },
      { $addToSet: { packageIds: packageId } },
      { new: true, upsert: true }
    );
    return wishlist;
  }

async removeFromWishlist(userId: string, packageId: string): Promise<IWishlist> {
  const wishlist = await WishlistModel.findOneAndUpdate(
    { userId },
    { $pull: { packageIds: packageId } },
    { new: true }
  );

  if (!wishlist) {
    throw new Error("Wishlist not found for user.");
  }

  return wishlist;
}


 async findWishlistByUserId(userId: string): Promise<any[]> {
  const result = await WishlistModel.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) }
    },
    {
      $lookup: {
        from: "packages", // must match actual collection name
        localField: "packageIds",
        foreignField: "_id",
        as: "packageDetails"
      }
    },
    {
      $project: {
        _id: 0,
        packageDetails: 1
      }
    }
  ]);

  return result[0]?.packageDetails || [];
}
}