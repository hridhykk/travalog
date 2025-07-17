import { AdminWalletModel } from "../models/adminwalletModel";
import { IAdminWalletRepository } from "../../domain/interfaces/repositories/IAdminWalletRepository";
import { IAdminWallet } from "../../domain/entities/adminwalletentities";

export class AdminWalletRepository implements IAdminWalletRepository {

  // Fetch the current admin wallet (if exists)
  async findWallet(): Promise<IAdminWallet | null> {
    const wallet = await AdminWalletModel.findOne();
    return wallet ? wallet.toObject() : null;
  }

  // Add or subtract amount from admin wallet
  async updateWalletAmount(amount: number): Promise<void> {
    let wallet = await AdminWalletModel.findOne();

    // If wallet doesn't exist, create one with default values
    if (!wallet) {
      if (amount < 0) {
        throw new Error("Cannot deduct from non-existent wallet");
      }

      wallet = new AdminWalletModel({
        totalAmount: amount,
        revenue: 0,
      });
    } else {
      const newTotal = wallet.totalAmount + amount;

      // Prevent wallet from going below zero
      if (newTotal < 0) {
        throw new Error("Insufficient funds in admin wallet");
      }

      wallet.totalAmount = newTotal;
    }

    await wallet.save();
  }
}
