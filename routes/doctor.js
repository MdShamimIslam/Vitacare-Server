import express from "express";
import {
  deleteDoctor,
  getAllDoctor,
  getDoctorProfile,
  getSingleDoctor,
  updateDoctor,
} from "../controllers/doctorController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRoute from "./review.js";

const router = express.Router();

// nested route
router.use("/:doctorId/reviews", reviewRoute);

// get single doctor route
router.get("/:id", getSingleDoctor);

// get all doctor route
router.get("/", getAllDoctor);

// update doctor route
router.put("/:id", authenticate, restrict(["doctor"]), updateDoctor);

// delete doctor route
router.delete("/:id", authenticate, restrict(["doctor"]), deleteDoctor);

// get doctor profile route
router.get("/profile/me", authenticate, restrict(["doctor"]), getDoctorProfile);

export default router;
