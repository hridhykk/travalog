import { Request, Response } from 'express';
import { IVendorRepository } from "../../../domain/interfaces/repositories/iVendorRepository";
import { IVendor } from "../../../domain/entities/vendorentities";

export class FetchVendorDataUseCase {
  constructor(private vendorRepository:IVendorRepository){

  }
  
  async execute(req:Request,res:Response,id:string){
    console.log('heuuuu')
    const fetchvendor = await this.vendorRepository.FindById(id);
    console.log(fetchvendor)
    if (!fetchvendor) {
      return {
       status:'false', message :"vendor not foundd"
     } }


     return {
        status:'success', message :"yehh found itt",Data:fetchvendor
     }
  }
}

export class EditVendorUseCase{
  constructor(private vendorRepository:IVendorRepository){

  }

  async execute(vendorId:string,vendorData:Partial<IVendor>):Promise<{status:string;message:string}>{
    console.log(vendorId);
    console.log(vendorData)
    const response = await this.vendorRepository.updateVendorDetails(vendorId,vendorData);
    return {
      status:'success',
      message:'vendor updated successfuly'
    }
  }
 
}