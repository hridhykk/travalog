import { IWallet } from "../../entities/walletentities";

export interface IWalletRepository {
  findWalletByUserId(userId: string): Promise<IWallet | null>;
  creditAmountToUser(userId: string, amount: number, description: string): Promise<void>;
}
