const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Create booking
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } =
      req.body;

    // if (
    //   !customerId ||
    //   !hostId ||
    //   !listingId ||
    //   !startDate ||
    //   !endDate ||
    //   !totalPrice
    // ) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    const newBooking = new Booking({
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
    });
    await newBooking.save();
    res.status(200).json(newBooking);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create a new Booking",
      error: error.message,
    });
  }
});

module.exports = router;
