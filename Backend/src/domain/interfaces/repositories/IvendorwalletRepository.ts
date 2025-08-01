import { IVendorWallet } from "../../entities/vendorwalletentities";


export interface ivendorwalletRepository{
  findWallet(): Promise<IVendorWallet  | null>;
 
}