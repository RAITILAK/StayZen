const express = require("express");
const router = express.Router();
const multer = require("multer");

const Listing = require("../models/Listing");
const User = require("../models/User"); // Ensure User model is used somewhere or remove it if not needed

// Configuration for multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Create a new listing
router.post("/create", upload.array("listingPhotos"), async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files; // Corrected from req.file to req.files
    if (!listingPhotos || listingPhotos.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    const listingPhotoPaths = listingPhotos.map((file) => file.path);

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });

    await newListing.save();

    res.status(200).json(newListing);
  } catch (error) {
    res
      .status(409)
      .json({ message: "Failed to create Listing", error: error.message });
    console.log(error);
  }
});

// Get listings
router.get("/", async (req, res) => {
  const qCategory = req.query.category;
  try {
    let listings;
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate(
        "creator"
      );
    } else {
      listings = await Listing.find().populate("creator");
    }
    res.status(200).json(listings);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to fetch listings", error: error.message });
    console.log(error);
  }
});

// get lisitng by search

router.get("/search/:search", async (req, res) => {
  const { search } = req.params;
  try {
    let listings = [];

    if (search == "all") {
      listings = await Listing.find().populate("creator");
    } else {
      listings = await Listing.find({
        $or: [
          { category: { $regex: search, $option: "i" } },
          { title: { $regex: search, $option: "i" } },
        ],
      }).populate("creator");
    }
    res.status(200).json(listings);
  } catch (error) {
    res
      .status(200)
      .json({ message: "fail to fetch listings", error: error.message });
    console.log(error);
  }
});
//listing details

router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId).populate("creator");
    res.status(200).json(listing);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Listing cannot found!", error: error.message });
  }
});
module.exports = router;
