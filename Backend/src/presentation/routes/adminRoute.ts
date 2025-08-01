// src/presentation/routes/adminRoute.ts
import { Request, Response } from "express";
import { Router } from "express";
import { AdminController } from "../controllers/admin/AdminController";
import { AdminUserController } from "../controllers/admin/AdminUserController";
import { adminAuthMiddleware } from '../../infrastructure/middleware/Adminmiddleware';
import { AdminPackageController } from "../controllers/admin/AdminPackageController";
import {BookingController} from "../controllers/admin/AdminBookingController"
import { AdminDashBoardController } from "../controllers/admin/AdminDashBoardController";
const router = Router();
const adminController = new AdminController();
const adminUserController = new AdminUserController();
const adminPackageController = new AdminPackageController ();
const bookingController = new BookingController();
const adminDashBoardController = new AdminDashBoardController();

router.post('/Login', adminController.login);
router.post('/refreshtoken', adminController.refreshToken);


router.get('/fetchUser',adminAuthMiddleware,adminUserController.fetchUser);
router.put('/editUser',adminAuthMiddleware, adminUserController.editUser);
router.get('/fetchVendor', adminAuthMiddleware,adminUserController.fetchVendor);
router.put('/editVendor', adminAuthMiddleware,adminUserController.editVendor);
router.get ('/fetchpackages',adminPackageController.fetchallpackages)
router.put('/updateVendor', adminAuthMiddleware,adminUserController.updateVendor);
router.patch('/blockpackages',adminPackageController.blockpackage)
router.patch('/verifypackage',adminPackageController.verifyPackage)
router.get('/fetchbookeddetails',  bookingController.fetchBookedDetails);

router.get('/fetchdashboarddata',  adminDashBoardController.fetchDashboardData);
export default router;