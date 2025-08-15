
import Footer from '../../components/user/common/Footer';
import { SidebarNav } from '../../components/user/common/Userprofilesidebar'

import Header from "../../components/user/common/commonHeader2";
import UserDetails from '../../components/user/userProfile'
const UserProfilepage = () => {
  return (
    <div>
      <Header />
      <div className="flex ">
        
        <SidebarNav />
        <UserDetails />
      </div>
      <Footer />
    </div>


  );
};

export default UserProfilepage;