import express from "express";
import {
  deleteDoctor,
  getAllDoctor,
  getDoctorProfile,
  getSingleDoctor,
  updateDoctor,
  getAllDoctorByAdmin,
  updateDoctorStatusByAdmin
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

// get all doctor (admin only)
router.get(
  "/admin/getAllDoctors",
  authenticate,
  restrict(["admin"]),
  getAllDoctorByAdmin
);
// delete doctor
router.delete("/admin/:id", authenticate, restrict(["admin"]), deleteDoctor);
router.put("/admin/:id", authenticate, restrict(["admin"]), updateDoctorStatusByAdmin);

export default router;
