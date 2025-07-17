import { Request,Response,NextFunction } from "express";
import { FetchVendorDataUseCase,EditVendorUseCase } from "../../../application/use-case/vendor/vendorProfileUseCase";
import {VendorRepository} from '../../../infrastructure/repositories/VendorRepository'
import { IVendor } from "../../../domain/entities/vendorentities";

export class VendorProfileController{
private fetchVendorDataUseCase : FetchVendorDataUseCase
private editVendorUseCase :EditVendorUseCase
constructor(){
  const vendorRepository = new VendorRepository();
  this.fetchVendorDataUseCase =new FetchVendorDataUseCase( vendorRepository)
this.editVendorUseCase = new EditVendorUseCase(vendorRepository)
}

fetchVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Corrected id extraction - prefer params or body over query for email;
    console.log('helooooooooo')
    const id = req.params.id|| req.body.id|| req.query.id;
    console.log('helooooooooo')
console.log(id)
    if (!id) {
      res.status(400).json({
        status: "error",
        message: "Email is required"
      });
      return;
    }

    const result = await this.fetchVendorDataUseCase.execute(req,res,id);
    console.log(result)
    res.status(result?.status === 'success' ? 200 : 401).json({ 
      status: result?.status,
      message: result?.message,
      Data:result?.Data 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: error instanceof Error ? error.message : "An unexpected error occurred" 
    });
  }
}


editvendor=async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
console.log('heyy hello ',req.body)
const vendorId = req.query.vendorId as string;
const vendorData = req.body as Partial<IVendor>;
const result= await this.editVendorUseCase.execute(vendorId, vendorData);
res.status(200).json({
  status:result.status, 
  message: result.message

});
  }catch(error){
    res.status(500).json({ 
      status: "error", 
      message: error instanceof Error ? error.message : "An unexpected error occurred" 
    });
  }
}
}