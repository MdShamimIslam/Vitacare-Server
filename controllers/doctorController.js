import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const getAllDoctor = async (req, res) => {
  try {
    const { query, limit, page } = req.query;

    const queryCondition = { isApproved: "approved" };

    if (query) {
      queryCondition.$or = [
        { name: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } },
      ];
    }

    const perPage = parseInt(limit) || 4;
    const currentPage = parseInt(page) || 1;

    const totalDoctors = await Doctor.countDocuments(queryCondition);
    const doctors = await Doctor.find(queryCondition)
      .select("-password")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      success: true,
      data: doctors,
      totalDoctors,
      totalPages: Math.ceil(totalDoctors / perPage),
      currentPage,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Doctor was not found",
    });
  }
};
export const getAllDoctorByAdmin = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select("-password");

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Doctor was not found",
    });
  }
};

// get single doctor
export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }
};

// update doctor
export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Doctor updated Failed",
    });
  }
};

// delete doctor
export const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    await Doctor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};

// get doctor profile
export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;
  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const { password, ...rest } = doctor._doc;

    const appointments = await Booking.find({ doctor: doctorId }).populate(
      "user"
    );

    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, cann't get user",
    });
  }
};

// update doctor status by admin
export const updateDoctorStatusByAdmin = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        $set: {
          isApproved: "approved",
        },
      },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: "Doctor status updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Doctor status updated Failed",
    });
  }
};
