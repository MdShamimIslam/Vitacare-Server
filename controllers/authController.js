import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { name, email, password, role, gender, photo } = req.body;

  try {
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }
    // check if the user
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        gender,
        photo,
      });
    } else if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashedPassword,
        role,
        gender,
        photo,
      });
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Registration successfull" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error. Try again!" });
  }
};

export const login = async (req, res) => {
  const { email } = req.body;

  try {
    let user = null;

    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    // check if user exist or not
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password
    const isPassworMatch = await bcrypt.compare(req.body.password, user?.password);

    if (!isPassworMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // create and sign jwt token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const { password, role, appointments, ...rest } = user._doc;

    res
      .status(200)
      .json({
        status: true,
        message: "Successfully login",
        token,
        data: { ...rest },
        role
      });
      
  } catch (error) {
    res.status(500).json({ status: false, message: "failed to login" });
  }
};
