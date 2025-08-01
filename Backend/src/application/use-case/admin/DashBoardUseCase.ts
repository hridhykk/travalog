
import { IVendorRepository } from "../../../domain/interfaces/repositories/iVendorRepository";


export class DashBoardUseCase {
  constructor(private readonly vendorRepository: IVendorRepository) {}

  async execute(range: string): Promise<{ totalVendors: number; status: string; dashboardData: any[] }> {
    try {
      console.log("Range received:", range);
      const totalVendors = await this.vendorRepository.getVendorCount(range);

      const dashboardData = [
        { name: "Total Vendors", value: totalVendors },
        // Add more data here if needed
      ];

      return {
        status: "success",
        totalVendors,
        dashboardData, // ✅ Add this line
      };
    } catch (error) {
      throw {
        status: "error",
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
}
