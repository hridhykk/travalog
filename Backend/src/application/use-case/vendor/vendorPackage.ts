import { IPackage} from '../../../domain/entities/packageentities';
import { IPackageRepository } from '../../../domain/interfaces/repositories/iPackageRepository';

export class RegisterPackageUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(packageData: IPackage): Promise<{ status: string; message: string; package?: IPackage }> {
    try {
      // Validate required fields
      // console.log('heyyy alooo how are uouuuu')
      // const requiredFields: (keyof IPackage)[] = [
      //   'vendorId', 'packageName', 'companyName', 'venue', 
      //   'price', 'duration', 'inclusion', 'exclusion', 
      //   'packageDescription', 'image1'
      // ];

      // for (const field of requiredFields) {
      //   if (!packageData[field]) {
      //     return {
      //       status: 'error',
      //       message: `Missing required field: ${field}`
      //     };
      //   }
      // }
console.log('heyyy')
     
      const createdPackage = await this.packageRepository.create(packageData);

      return {
        status: 'success',
        message: 'Package added successfully',
        package: createdPackage
      };
    } catch (error) {
      console.error('Error in RegisterPackageUseCase:', error);
      return {
        status: 'error',
        message: 'Failed to add package'
      };
    }
  }
}


export class FetchPackageUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(vendorId: string, page: number, limit: number): Promise<{ status: string; message: string; data?: any; totalCount?: number }> {
    try {
      const { packages, totalCount } = await this.packageRepository.findByVendorIdWithPagination(vendorId, page, limit);
if(!packages&&totalCount){
  return {
    status: 'failed',
    message: 'Packages fetched successfully',
   
  };
}
      return {
        status: 'success',
        message: 'Packages fetched successfully',
        data: packages,
        totalCount: totalCount || 0,
      };
    } catch (error) {
      console.error('Error in FetchPackageUseCase:', error);
      return {
        status: 'error',
        message: 'Failed to fetch packages',
      };
    }
  }
}

export class UpdateSlotUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async updateSlot(
    packageId: string,
    date: string,
    maximumAllowedPackages: number
  ): Promise<any> {
    const packageData = await this.packageRepository.findById(packageId);
  
    if (!packageData) {
      throw new Error("Package not found.");
    }
  console.log('helooooo')
    packageData.availableAndBookedDates = packageData.availableAndBookedDates || [];
  
    const existingDateIndex = packageData.availableAndBookedDates.findIndex(
      (slot) => slot.date === date
    );
  
    if (existingDateIndex !== -1) {
      const existingSlot = packageData.availableAndBookedDates[existingDateIndex];
  
      // Check if we're trying to increase packages after it was marked unavailable
      if (existingSlot.maximumAllowedPackages === 0 && maximumAllowedPackages > 0) {
        packageData.availableAndBookedDates[existingDateIndex] = {
          ...existingSlot,
          maximumAllowedPackages, // Update with the new number
        };
      } else if (existingSlot.numberOfPackagesBookedByUser > maximumAllowedPackages) {
        // Validate that new max isn't less than already booked
        throw new Error(
          "Cannot set maximum allowed packages below the number of already booked packages."
        );
      } else {
        packageData.availableAndBookedDates[existingDateIndex] = {
          ...existingSlot,
          maximumAllowedPackages,
        };
      }
    } else {
      // If date doesn't exist, create a new entry
      packageData.availableAndBookedDates.push({
        date,
        maximumAllowedPackages,
        numberOfPackagesBookedByUser: 0,
      });
    }

    console.log('hiiiii')
  
    return this.packageRepository.update(packageData); // Save the updated package
  }
}


export class FetchAllPackagesUseCase {
  constructor(private packageRepository: IPackageRepository) {}
  async execute(): Promise<{ status: string; message: string; data?: any }> {
    try {
      const packages = await this.packageRepository.findAllPackages()

     if(!packages){
      return {
        status: 'failed',
        message: 'Packages fetched failed',
       
      };
     }



     return {
      status: 'success',
      message: 'Packages fetched successfully',
      data: packages,
    };
     
    } catch (error) {
      console.error('Error in FetchPackageUseCase:', error);
      return {
        status: 'error',
        message: 'Failed to fetch packages',
      };
    }
  }

}

export class FetchPackageDetailsUseCase{
  constructor(private packageRepository: IPackageRepository) {}
  async execute(id:string): Promise<{ status: string; message: string; data?: any }> {
    try{
      const packageData = await this.packageRepository.findById(id);
    
      return {
        status: 'success',
        message: 'Package added successfully',
       data: packageData
      };
    }catch(error){
      console.error('Error in FetchPackageUseCase:', error);
      return {
        status: 'error',
        message: 'Failed to fetch packages',
      };
    }
    

  }

}

export class CheckavailabilityUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(packageId: string, selectedDate: string, numPeople: number): Promise<{ status: string; message: string }> {
    try {
      // Fetch the package by ID
      const packageData = await this.packageRepository.findById(packageId);
      if(!packageData){
        return {
          status: 'error',
          message: 'Package is not available for the selected date. Not enough slots available.',
        };
      }
      packageData.availableAndBookedDates = packageData.availableAndBookedDates || [];
      // Fetch the minimum and maximum number of people from the package
      const { minPersons, maxPersons } = packageData;

      // Check if the number of people is within the allowed range
      if (numPeople < minPersons || numPeople > maxPersons) {
        return {
          status: 'failed',
          message: `The package is available for a minimum of ${minPersons} and a maximum of ${maxPersons} people.`,
        };
      }

      // Convert selectedDate string to Date object
      const selectedDateObj = new Date(selectedDate);

      // Check if the selected date exists in availableAndBookedDates
      const availability = packageData.availableAndBookedDates.find(
        (entry) => new Date(entry.date).toISOString().slice(0, 10) === selectedDateObj.toISOString().slice(0, 10)
      );

      // If no availability entry is found, assume it is available and proceed
      if (!availability) {
        return {
          status: 'success',
          message: 'Package is available for the selected date and number of people.',
        };
      }

      // Check if the number of packages booked exceeds the available packages for the selected date
      if (availability.numberOfPackagesBookedByUser + 1 > availability.maximumAllowedPackages-availability.numberOfPackagesBookedByUser ) {
        return {
          status: 'failed',
          message: 'Package is not available for the selected date. Not enough slots available.',
        };
      }

      // If no issues, the package is available
      return {
        status: 'success',
        message: 'Package is available for the selected date and number of people.',
      };
    } catch (error) {
      console.error('Error in CheckavailabilityUseCase:', error);
      return {
        status: 'error',
        message: 'Failed to check availability.',
      };
    }
  }
}


export class DeletePackageUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(packageId: string): Promise<{ status: string; message: string }> {
    try {
    
      const result = await this.packageRepository.delete(packageId);
      return {
        status: 'success',
        message: 'Package deleted successfully',
      };
    } catch (error) {
    
      console.error('Error deleting package:', error);
      return {
        status: 'error',
        message: 'Failed to delete package',
      };
    }
  }
}



export class UpdatePackageUseCase {
  constructor(private packageRepository: IPackageRepository) {}
  // Method to update the package in the database
  async execute(packageId: string, packageData: Partial<IPackage>):Promise<{ status: string; message: string }> {
      // Find and update the package in the repository
      try{
      const updatedPackage = await this.packageRepository.updatepackages(packageId, packageData);
      return {
        status:'success',
        message:'updated packages'
      }
    } catch (error) {
      console.error("Error in use case:", error);
      throw new Error("Error updating package");
    }
  }
}

