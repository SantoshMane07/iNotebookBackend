const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Prem Mane";
const fetchuser = require("../middleware/fetchuser");

//Route 1 : Create a User using : POST "/api/auth/createuser"
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Name must be atleast 3 characters").isLength({ min: 3 }),
    body("password", "Name must be atleast 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    // Checking if there any errors related to user fields
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Check user email already exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "User with this email already exists" });
      }
      //Hashing Password
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      //Create new User
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      //Sending Token on Successful user creation
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = await jwt.sign(data, JWT_SECRET);
      success =true;
      res.json({success:success, authtoken: authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route 2 : Authenticate a User using : POST "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false
    // Checking if there any errors related to user fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Validating email and password
    const email = req.body.email;
    const password = req.body.password;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }
      //Sending Token on Successful user creation
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = await jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success:success, authtoken: authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route 3 : Get looggedin User Details : POST "/api/auth/getuser"
router.get("/getuser", fetchuser ,async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured 1");
  }
});

module.exports = router;
