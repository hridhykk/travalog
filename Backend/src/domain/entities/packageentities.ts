export interface IAvailableAndBookedDate {
  date: string; 
  maximumAllowedPackages: number; 
  numberOfPackagesBookedByUser: number; 
}

export interface IPackage {
  _id?: string; 
  vendorId: string; 
  packageName: string;
  companyName: string; 
  venue: string; 
  price: number; 
  duration: string; 
  inclusion: string[]; 
  exclusion: string[]; 
  packageDescription: string; 
  dayDescriptions: string[]; 
  availableAndBookedDates?: IAvailableAndBookedDate[]; 
  images: string[]; 
  maxPersons: number; 
  minPersons: number;
  maxDuration:number;
  PackageType:string;
  averageRating?: number;
totalReviews?: number;
  popularity?:number;
  isBlocked?: boolean;
  isVerified?: boolean;
  maxPackagesPerDay: number; 
  createdAt?: Date; 
  updatedAt?: Date; 
}
