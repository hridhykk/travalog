import { IAdminWallet } from "../../entities/adminwalletentities";


export interface IAdminWalletRepository {
  findWallet(): Promise<IAdminWallet | null>;
  updateWalletAmount(amount: number): Promise<void>;
}