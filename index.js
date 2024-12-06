import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import doctorRoute from "./routes/doctor.js";
import reviewRoute from "./routes/review.js";
import bookingRoute from "./routes/booking.js";

const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: true,
};

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// auth route
app.use("/api/v1/auth", authRoute);
// users route
app.use("/api/v1/users", userRoute);
// users route
app.use("/api/v1/doctors", doctorRoute);
// reviews route
app.use("/api/v1/reviews", reviewRoute);
// booking route
app.use("/api/v1/bookings", bookingRoute);

// connect database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("MongoDB Connection is Failed");
  }
};

await connectDB();

app.get("/", (req, res) => {
  res.send("Vitacare server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
