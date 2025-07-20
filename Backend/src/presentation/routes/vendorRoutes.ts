import { Router } from "express";
import { VendorController } from "../controllers/vendor/VendorController";
import { VendorProfileController } from "../controllers/vendor/VendorProfileController";
import { VendorPackageController } from '../controllers/vendor/VendorPackageController';
import  uploadS3 from '../../utils/multer'
import { VendorBookingsController } from "../controllers/vendor/VendorBookingDetails";
const router = Router();


const vendorController = new VendorController();
const vendorProfileController = new VendorProfileController();
const vendorPackageController = new VendorPackageController();
const vendorbookingscontroller = new VendorBookingsController();




router.post('/Login', vendorController.login);
router.post('/Register', vendorController.register);
router.post('/refreshtoken', vendorController.refreshToken);
router.post('/verifyOtp', vendorController.verifyOtp);
router.post('/resendotp', vendorController.resendOtp);
router.post('/verifyemail', vendorController.verifyemail);
router.post('/resetpass_otpverify', vendorController.resetPassverifyOtp);
router.post('/resend_resetpass_Otp', vendorController.resendResetpassOtp);
router.post('/resetpassword', vendorController.resetPassword);
router.get('/fetchdata', vendorProfileController.fetchVendor);
router.post('/editvendor',vendorProfileController.editvendor)

router.post(
  '/registerPackage',
  vendorPackageController.registerPackage
);

router.get('/fetchpackages', vendorPackageController.fetchPackagesWithPagination);

router.put('/updateslot', vendorPackageController.updateSlot );
router.get('/fetchallpackages',vendorPackageController.fetchallpackages)
router.get('/fetchpackage',vendorPackageController.fetchpackage);
router.post('/checkavilability',vendorPackageController.checkAvailability)
router.delete('/deletePackage',vendorPackageController.deletePackage);

router.put('/updatepackage',vendorPackageController.updatepackage);
router.get('/fetchbookings',vendorbookingscontroller.FetchBookings)

export default router;
