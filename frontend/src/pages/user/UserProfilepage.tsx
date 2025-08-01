
import {SidebarNav} from '../../components/user/common/Userprofilesidebar'

  import  Header  from "../../components/user/common/commonHeader2";
import UserDetails from '../../components/user/userProfile'
const UserProfilepage= () => {
  return (
    <div className="flex min-h-screen">
      <Header />
      <SidebarNav />
      <UserDetails/>
    </div>
  );
};

export default UserProfilepage;