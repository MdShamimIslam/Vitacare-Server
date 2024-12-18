import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";

export const getCheckoutSession = async (req, res) => {
  try {
    // get currently booked doctor
    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId);

    if (doctor.ticketPrice < 100) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Minimum ticket price must be at least 50 BDT",
        });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: doctor.ticketPrice * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    // create a new booking
    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: session.id,
    });

    await booking.save();

    res
      .status(200)
      .json({ success: true, message: "Successfully Paid", session });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res
      .status(500)
      .json({ success: false, message: "Error for creating checkout session" });
  }
};

export const deleteBooking = async (req, res) => {
  const id = req.params.id;
  try {
    await Booking.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};

export const updateBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "approved",
        },
      },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Booking status updated Failed",
    });
  }
};
