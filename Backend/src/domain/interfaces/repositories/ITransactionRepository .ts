
import { ITransaction } from "../../entities/Transactionentitites";
export interface ITransactionRepository {
  getAdminRevenue(): Promise<number>;
  getVendorEarnings(vendorId: string): Promise<number>;
  getVendorSalesReport(vendorId: string, range: "daily" | "weekly" | "monthly" | "yearly"): Promise<ITransaction[]>;
  getAdminSalesReport(range: "daily" | "weekly" | "monthly" | "yearly"): Promise<ITransaction[]>;

}
