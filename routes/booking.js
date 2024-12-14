
import express from 'express';
import { authenticate, restrict } from '../auth/verifyToken.js';
import { getCheckoutSession, deleteBooking, updateBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post("/checkout-session/:doctorId", authenticate, getCheckoutSession);
router.delete("/:id", authenticate, restrict(["patient"]), deleteBooking);
router.put("/:id", authenticate, restrict(["doctor"]), updateBooking);

export default router;