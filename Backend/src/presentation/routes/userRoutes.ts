import { Router } from "express";
import { UserController } from "../controllers/user/UserController";
import { UserTripController } from "../controllers/user/userTripController";
import {UserAccountController} from '../controllers/user/UserProfile'
import { UserHomeController } from "../controllers/user/UserHomeController";

const router = Router();
const userController = new UserController();
const userTripController = new  UserTripController();
const userAccountController = new UserAccountController()
const userHomeController = new UserHomeController();

router.post('/verifyLogin',userController.login);
router.post('/Register',userController.register);
router.post('/verifyOtp',userController.verifyOtp);
router.post('/resendOtp',userController.resendOtp);

router.post('/GoogleRegister',userController.googleregister);
router.post('/GoogleLogin',userController.googlelogin);
router.post('/forgotpassword',userController.forgotpassword)
router.post('/resetPassverifyOtp',userController.resetPassverifyOtp);
router.post('/resetPassword',userController.resetPassword);
router.post('/refreshtoken',userController.refreshToken);
router.post('/resendResetpassOtp',userController.resendResetpassOtp);
router.post('/create-order',userTripController.createorder);
router.post('/createbooking',userTripController.createBooking);
router.get('/fetchuser',userAccountController.fetchUser );
router.get('/fetchbookingdetails',userAccountController.fetchbookingdetails);
router.get('/cancelBooking',userAccountController.CancelBooking)
router.post('/add-review',userAccountController.userReview );
router.get('/packages',userHomeController.fetchPackages);
// router.get('/fetchuserwallet',userAccountController.fetchUserWallet);
export default router;