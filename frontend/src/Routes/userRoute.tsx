import { Route, Routes ,Navigate,Outlet} from 'react-router-dom';
import UserLogin from '../pages/user/UserLogin';
import Register from '../pages/user/Register';
import Home from '../pages/user/Homepage';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import OTPpage from '../pages/user/OTPpage'
import ForgotpassOtppage from '../pages/user/ForgotpassOtppage';
import Resetpass from '../pages/user/ResetPass';
import Trippage from '../pages/user/Trippage';
import  PackageDetailspage from '../pages/user/PackageDetailspage';
import SlotavailabilityPage from '../pages/user/SlotavailabilityPage';
import UserProfilePage from '../pages/user/UserProfilepage';
import UserBookingdetailspage from '../pages/user/UserBookingdetailspage'
const ProtectedUserRoute = () => {
 
  const isAuthenticated = useSelector((state: RootState) => {
    return state.auth.isAuthenticated ;
  });

  if (!isAuthenticated) {
    return <Navigate to="/user" />;
  }
  return <Outlet />;
};


const PublicUserRoute = () => {
  
  const isAuthenticated = useSelector((state: RootState) => {
    return state.auth.isAuthenticated ;
  });
  if (isAuthenticated) {
    return <Navigate to={'/user/home'}  />;
  }

  return <Outlet />;
};

const UserRoutes = () => {
  return (
    <Routes>
      <Route  element={<PublicUserRoute/>}>
      <Route path="/" element={<UserLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="otp" element={<OTPpage />} />
      <Route path="resetpassword" element={<Resetpass />} />
      </Route >
      <Route path="/slotavailability/:id" element={< SlotavailabilityPage/>} />
      <Route path="resetpassOtp" element={<ForgotpassOtppage />} />
  <Route  element={<ProtectedUserRoute/>}>
  <Route path="home" element={<Home />} />
  <Route path="trips" element={<Trippage />} />
  <Route path="/packagedetails/:id" element={< PackageDetailspage/>} />
  <Route path="/profile" element={<UserProfilePage/>} />
  <Route path="/bookings" element={<UserBookingdetailspage/>} />
  </Route>
     
    </Routes>
  );
};

export default UserRoutes;