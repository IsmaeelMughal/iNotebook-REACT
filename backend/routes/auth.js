const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "IsmaeelIsHealin@g";

// ROUTE 1 : Create User on endpoint POST: /api/auth/createuser . with unique email validations
router.post(
  "/createuser",
  [
    body("name", "Please Enter a valid name").isLength({ min: 3 }),
    body("email", "Please Enter a valid Email").isEmail(),
    body("password", "Password must of 5 Characters.").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // Email Validayion for uniqueness
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email is already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // creating a new User
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);
      //res.json(user);
      res.json({ authToken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Some Error Has Occured");
    }
  }
);

// ROUTE 2 : Authenticating User with POST: /api/auth/login with validation
router.post(
  "/login",
  [
    body("email", "Please Enter a Valid Emiail!!!").isEmail(),
    body("password", "Password cannot be empty.").exists(),
  ],
  async (req, res) => {
    // Validaion for valid fields
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Please use correct credentials!!!" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please use correct credentials!!!" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error!!!");
    }
  }
);

// ROUTE 3 : Get Logged in user Details with POST: /api/auth/getuser loginRequired
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error!!!");
  }
});

module.exports = router;
