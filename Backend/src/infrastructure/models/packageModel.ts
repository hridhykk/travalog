import mongoose, { Schema, Document } from 'mongoose';
import { IPackage, IAvailableAndBookedDate } from '../../domain/entities/packageentities';

const AvailableAndBookedDateSchema: Schema = new Schema<IAvailableAndBookedDate>({
  date: { type: String, required: true },
  maximumAllowedPackages: { type: Number, required: true },
  numberOfPackagesBookedByUser: { type: Number, required: true ,default:4},
});

const PackageSchema: Schema = new Schema<IPackage>(
  {
    vendorId: { type: String, required: true },
    packageName: { type: String, required: true },
    companyName: { type: String, required: true },
    venue: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    inclusion: { type: [String], required: true },
    exclusion: { type: [String], required: true },
    packageDescription: { type: String, required: true },
    dayDescriptions: { type: [String], required: true },
    availableAndBookedDates: { type: [AvailableAndBookedDateSchema], default: [] },
    images: { type: [String], required: true },
    maxPersons: { type: Number, required: true },
    minPersons: { type: Number, required: true },
    popularity: { type: Number, required: true , default: 1},
    maxDuration:{type:Number,required:true},
    PackageType:{type:String,required:true},
   averageRating: { type: Number, default: 0 },
totalReviews: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    maxPackagesPerDay: { type: Number, required: true, default: 4 },
  },
  { timestamps: true }
);

const PackageModel = mongoose.model<IPackage & Document>('Package', PackageSchema);

export { PackageModel };
