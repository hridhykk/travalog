import mongoose, { Schema, Document } from 'mongoose';
import { IWishlist } from '../../domain/entities/wishlistentities';

const wishlistSchema: Schema = new Schema<IWishlist>(
{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    packageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
  }, { timestamps: true }
);

const WishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema);
export  { WishlistModel };
