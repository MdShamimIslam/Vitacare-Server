
import express from "express"
import { authenticate, restrict } from "../auth/verifyToken.js";
import { createReview, getAllReviews } from "../controllers/reviewController.js";

const router = express.Router({mergeParams:true});

// get and post review routes
router
    .route("/")
    .get(getAllReviews)
    .post(authenticate, restrict(["patient"]), createReview);

export default router;