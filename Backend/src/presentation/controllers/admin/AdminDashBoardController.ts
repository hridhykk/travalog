import { DashBoardUseCase } from "../../../application/use-case/admin/DashBoardUseCase";
import { VendorRepository } from "../../../infrastructure/repositories/VendorRepository";
import { Request, Response, NextFunction } from "express";



export class AdminDashBoardController {
  private dashBoardUseCase: DashBoardUseCase;

  constructor() {
    const vendorRepository = new VendorRepository();
    this.dashBoardUseCase = new DashBoardUseCase(vendorRepository);
  }

  fetchDashboardData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.query)
      const range = req.query.range as string;
      console.log("Range received:", range);
      const result = await this.dashBoardUseCase.execute(range);

    res.status(200).json({
  status: result.status,
  dashboardData: result.dashboardData,
});
    } catch (error) {
      console.error("Error in fetchDashboardData controller:", error);
      res.status(500).json({
        status: "error",
        message: "An unexpected error occurred",
      });
    }
  };
}