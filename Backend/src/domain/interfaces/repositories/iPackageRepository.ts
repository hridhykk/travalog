import { IPackage } from '../../entities/packageentities';

export interface IPackageRepository {
  create(packageData: IPackage): Promise<IPackage>;
  findAllPackages(): Promise<IPackage[]>;
  findById(id: string): Promise<IPackage | null>;
  findByVendorId(vendorId: string): Promise<IPackage[]>;
  update(packageData: IPackage): Promise<IPackage>;
  updateBlockStatus(packageId: string, is_blocked: boolean): Promise<IPackage | null> ;
  updateField(packageId: string, updateFields: Partial<IPackage>): Promise<IPackage | null> ;
   delete(packageId: string):Promise<void>; 
   updatepackages(packageId: string, packageData: Partial<IPackage>): Promise<IPackage | null> ;
   findByVendorIdWithPagination(vendorId: string, page: number, limit: number): Promise<{ packages: any[]; totalCount: number }>;
   findAllWithPaginationAndSearch(
    page: number,
    limit: number,
    searchTerm?: string,
  ): Promise<{ packages: IPackage[]; totalCount: number }>
}