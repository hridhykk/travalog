
import { Header } from "../../components/vendor/common/Header";
import { SidebarNav } from '../../components/vendor/common/VendorprofileSidebar';
import SlotManagement from '../../components/vendor/Slotupdate'

function VendorSlotupdate() {
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
         <SlotManagement/>
        </div>
      </div>
    </div>
  </div>
  )
}

export default VendorSlotupdate