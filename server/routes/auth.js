const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../models/User");

//configuration of multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); //store uploaded file in the upload folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //use the original filename
  },
});

const upload = multer({ storage });
//USER REGISTER
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    //take all information from the form
    const { firstName, lastName, email, password } = req.body;

    //the uploaded file is available as req.file
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    //path to the uploADED PROFILE PHOTO

    const profileImagePath = profileImage.path;

    //check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    //hash password

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    //save the new user

    await newUser.save();

    //send successful message
    res
      .status(200)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "registration failed!", error: error.message });
  }
});
//user login
router.post("/login", async (req, res) => {
  try {
    //take the information from the form
    const { email, password } = req.body;

    //check if the user exsit

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User doesn't exists!" });
    }

    //compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // generate jwt tokens

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Convert user to a plain object and delete the password field
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
