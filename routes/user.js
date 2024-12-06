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

// get all users route (admin only)
router.get("/", authenticate, restrict(["admin"]), getAllUser);

// update user route
router.put("/:id", authenticate, restrict(["patient"]), updateUser);

// delete user route
router.delete("/:id", authenticate, restrict(["patient"]), deleteUser);

// get user profile route
router.get("/profile/me", authenticate, restrict(["patient"]), getUserProfile);

// get my appintments route
router.get(
  "/appointments/my-appointments",
  authenticate,
  restrict(["patient"]),
  getMyAppointments
);

export default router;
