
import {SidebarNav} from '../../components/vendor/common/VendorprofileSidebar'

  import { Header } from "../../components/vendor/common/Header";
  import {VendorDetails} from '../../components/vendor/VendorProfile';
const VendorProfilePage = () => {
  return (
    <div className="flex min-h-screen">
      <Header />
      <SidebarNav />
      <VendorDetails/>
    </div>
  );
};

export default VendorProfilePage;