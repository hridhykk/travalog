import { IBookingRepository } from "../../../domain/interfaces/repositories/iBookingRepository";
import { IBooking } from "../../../domain/entities/bookingentities";
import { IPackageRepository } from "../../../domain/interfaces/repositories/iPackageRepository";
import { IAdminWalletRepository } from "../../../domain/interfaces/repositories/IAdminWalletRepository";
export class BookingUseCase {
  constructor(
    private iBookingRepository: IBookingRepository,
    private iPackageRepository: IPackageRepository,
    private iAdminWalletRepository: IAdminWalletRepository
  ) {}

  async execute(
    orderId: string,
    paymentId: string,
    userId:string,
    amount: string,
    numPeople: string,
    packageId: string,
    packageName: string,
    bookedDate: string
  ): Promise<{ status: string; message: string }> {
    // Parse amount and numPeople
    const parsedAmount = parseFloat(amount);
    const parsedNumPeople = parseInt(numPeople);

    if (isNaN(parsedAmount) || isNaN(parsedNumPeople)) {
      throw new Error("Invalid amount or number of people.");
    }

    // Prepare booking data
    const bookingData: IBooking = {
      orderId,
      paymentId,
      userId,
      amount: parsedAmount,
      numPeople: parsedNumPeople,
      packageId,
      packageName,
      bookedDate,
      paymentStatus: "successful",
      isVerified: true,
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Creating booking with data:", bookingData);

   
    await this.iBookingRepository.create(bookingData);

    await this.iAdminWalletRepository.updateWalletAmount(parsedAmount);
  
    await this.updatePackageBookingDetails(packageId, bookedDate);

    return {
      status: "success",
      message: "Booking created successfully.",
    };
  }





  private async updatePackageBookingDetails(packageId: string, bookedDate: string): Promise<void> {
  
    const packageData = await this.iPackageRepository.findById(packageId);
    if (!packageData) {
      throw new Error("Package not found.");
    }
  
    // Initialize availableAndBookedDates if not already present
    packageData.availableAndBookedDates = packageData.availableAndBookedDates || [];
  
    // Find the corresponding date
    let availableDate = packageData.availableAndBookedDates.find(date => date.date === bookedDate);
  
    // If the date is not available, add it to the availableAndBookedDates array
    if (!availableDate) {
      availableDate = {
        date: bookedDate,
        numberOfPackagesBookedByUser: 0,
        maximumAllowedPackages: 4, // Set a default value for maximumAllowedPackages
      };
      packageData.availableAndBookedDates.push(availableDate);
    }
  
    // Check booking limits
    if (availableDate.numberOfPackagesBookedByUser >= availableDate.maximumAllowedPackages) {
      throw new Error("Maximum bookings reached for this date.");
    }
  
    // Increment the number of packages booked
    availableDate.numberOfPackagesBookedByUser += 1;
  
    // Ensure popularity is set to at least 1
    packageData.popularity = packageData.popularity || 1; // Default to 1 if it's undefined or 0
  
    // Increment popularity
    packageData.popularity += 1;
  
    // Save the updated package using the repository
    await this.iPackageRepository.updateField(packageId, {
      availableAndBookedDates: packageData.availableAndBookedDates,
      popularity: packageData.popularity,
    });
  }
  
}
