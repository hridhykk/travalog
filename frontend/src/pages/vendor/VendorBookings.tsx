import {SidebarNav} from '../../components/vendor/common/VendorprofileSidebar'

  import { Header } from "../../components/vendor/common/Header";
import Bookings from '../../components/vendor/Bookings';
function VendorBookings() {
  return (
       <div className="flex min-h-screen">
          <Header />
          <SidebarNav />
         <Bookings/>
        </div>
  )
}

export default VendorBookings