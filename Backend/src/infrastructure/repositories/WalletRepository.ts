import { IWallet , IWalletTransaction } from "../../domain/entities/walletentities";
import { WalletModel } from "../models/walletModel";
import { IWalletRepository } from "../../domain/interfaces/repositories/iWalletRepository";

export class WalletRepository implements IWalletRepository {
  // Find user's wallet
  async findWalletByUserId(userId: string): Promise<IWallet | null> {
    const wallet = await WalletModel.findOne({ userId });
    return wallet ? wallet.toObject() : null;
  }

  // Credit amount to user's wallet (used on booking cancel)
  async creditAmountToUser(userId: string, amount: number, description: string): Promise<void> {
    let wallet = await WalletModel.findOne({ userId });

    if (!wallet) {
      wallet = new WalletModel({
        userId,
        balance: amount,
        transactions: [
          {
            transfertype: "credit",
            amount,
            description,
            status: "success"
          }
        ]
      });
    } else {
      wallet.balance += amount;
      wallet.transactions.push({
        transfertype: "credit",
        amount,
        description,
        status: "success"
      });
    }

    await wallet.save();
  }
}