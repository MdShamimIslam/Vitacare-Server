import express from "express";
import {
  deleteUser,
  getAllUser,
  getMyAppointments,
  getSingleUser,
  getUserProfile,
  updateUser,
} from "../controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

// get single user route
router.get("/:id", authenticate, restrict(["patient"]), getSingleUser);
// update user route
router.put("/:id", authenticate, restrict(["patient"]), updateUser);
// delete user route
router.delete("/:id", authenticate, restrict(["patient"]), deleteUser);
// get user profile route
router.get("/profile/me", authenticate, restrict(["patient"]), getUserProfile);
// get patient appintments route
router.get(
  "/appointments/my-appointments",
  authenticate,
  restrict(["patient"]),
  getMyAppointments
);
// get all users route (admin only)
router.get("/", authenticate, restrict(["admin"]), getAllUser);
// get admin profile route (admin only)
router.get("/admin/profile", authenticate, restrict(["admin"]), getUserProfile);
router.delete("/admin/:id", authenticate, restrict(["admin"]), deleteUser);

export default router;
