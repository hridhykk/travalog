


import {SidebarNav} from '../../components/user/common/Userprofilesidebar'

  import { Header } from "../../components/user/common/commonHeader";
import BookingDetails from '../../components/user/BookingDetails'
const UserBookingdetailspage= () => {
  return (
    <div className="flex min-h-screen">
      <Header />
      <SidebarNav />
      < BookingDetails/>
    </div>
  );
};

export default UserBookingdetailspage;