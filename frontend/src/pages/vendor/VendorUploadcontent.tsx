//import React from 'react';
import { Header } from "../../components/vendor/common/Header";
import { SidebarNav } from '../../components/vendor/common/VendorprofileSidebar';
import TravelPackageForm from '../../components/vendor/Uploadcontents';

const VendorUploadContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header stays fixed at top */}
      <Header />
      
      {/* Main content area */}
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0 w-64 h-full">
          <SidebarNav />
        </div>
        
        {/* Main content with proper spacing */}
        <div className="flex-1 ml-64">
          {/* Add top padding to account for fixed header */}
          <div className="pt-16 px-6">
            <TravelPackageForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorUploadContent;