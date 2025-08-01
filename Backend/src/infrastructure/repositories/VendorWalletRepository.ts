import { IVendorWallet } from "../../domain/entities/vendorwalletentities";
import { VendorWalletModel } from "../models/vendorWalletModel";
import { ivendorwalletRepository } from "../../domain/interfaces/repositories/IvendorwalletRepository";


export class VendorWalletRepository implements ivendorwalletRepository {
  async findWallet(): Promise<IVendorWallet | null> {
    return await VendorWalletModel.findOne().exec();
  }
}