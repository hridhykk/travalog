import { IPackage } from "../../entities/packageentities";
import { IWishlist } from "../../entities/wishlistentities";


export interface IWishlistRepository {
  addToWishlist(userId: string, packageId: string): Promise<IWishlist>;
  removeFromWishlist(userId: string, packageId: string): Promise<IWishlist>;
  findWishlistByUserId(userId: string): Promise<any[]>;  // now returns full packages
}