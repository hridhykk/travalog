import { ITransactionRepository } from "../../domain/interfaces/repositories/ITransactionRepository ";
import { TransactionModel } from "../models/transactionModel";
import { ITransaction } from "../../domain/entities/Transactionentitites";
import moment from "moment";


export class TransactionRepository implements ITransactionRepository {
  async getAdminRevenue(): Promise<number> {
    const result = await TransactionModel.aggregate([
      { $match: { type: "admin_cut", status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    return result[0]?.total || 0;
  }

  async getVendorEarnings(vendorId: string): Promise<number> {
    const result = await TransactionModel.aggregate([
      { $match: { to: vendorId, type: "vendor_payout", status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    return result[0]?.total || 0;
  }

  async getVendorSalesReport(vendorId: string, range: "daily" | "weekly" | "monthly" | "yearly"): Promise<ITransaction[]> {
    const { start, end } = this.getDateRange(range);
    return await TransactionModel.find({
      to: vendorId,
      type: "vendor_payout",
      status: "success",
      createdAt: { $gte: start, $lte: end }
    }).exec();
  }

  async getAdminSalesReport(range: "daily" | "weekly" | "monthly" | "yearly"): Promise<ITransaction[]> {
    const { start, end } = this.getDateRange(range);
    return await TransactionModel.find({
      type: "admin_cut",
      status: "success",
      createdAt: { $gte: start, $lte: end }
    }).exec();
  }

  // async getAdminWalletRevenue(): Promise<number> {
  //   const wallet = await AdminWalletModel.findOne().sort({ updatedAt: -1 }).exec();
  //   return wallet?.revenue || 0;
  // }

  // async getVendorWalletRevenue(vendorId: string): Promise<number> {
  //   const wallet = await VendorWalletModel.findOne({ vendorId }).exec();
  //   return wallet?.balance || 0;
  // }

  private getDateRange(range: "daily" | "weekly" | "monthly" | "yearly") {
    const now = moment();
    let start: moment.Moment;

    switch (range) {
      case "daily":
        start = now.clone().startOf("day");
        break;
      case "weekly":
        start = now.clone().startOf("week");
        break;
      case "monthly":
        start = now.clone().startOf("month");
        break;
      case "yearly":
        start = now.clone().startOf("year");
        break;
      default:
        start = now.clone().startOf("day");
    }

    return { start: start.toDate(), end: now.toDate() };
  }
}
