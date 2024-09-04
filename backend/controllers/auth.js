const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { compare } = require("../utils/salt.js");
const { createSession } = require("../controllers/session");
const { JWT_SECRET } = require("../secret/secret.js");
const Session = require("../models/session");

exports.login = async (req, res, next) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        type: "Not Found",
        message: "Wrong Login Details",
      });
    }

    // Use try-catch block to handle errors from the compare function
    try {
      let match = await compare(password, user.password);
      if (match) {
        const token = await createSession(user._id.toString());

        res.status(200).json({
          status: "Success",
          message: "Correct Details",
          token: token,
          email: user.email,
        });
      } else {
        res.status(400).json({
          type: "Invalid Password",
          message: "Wrong Login Details",
        });
      }
    } catch (error) {
      // Handle errors from the compare function here
      console.log(error);
      res.status(500).json({
        type: "Internal Server Error",
        message: "An error occurred during password comparison.",
      });
    }
  } catch (err) {
    // Handle errors from the User.findOne function here
    console.log(err);
    res.status(500).json({
      type: "Internal Server Error",
      message: "An error occurred during user lookup.",
    });
  }
};

exports.getThisUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming token is sent as "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = await Session.findOne({ token });

    if (!session) {
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    const user = await User.findOne({ _id: session.userId });

    return res.status(200).json({ email: user.email, username: user.username });
  } catch (error) {
    return res
      .status(401)
      // .json({ message: "Invalid token", error: error.message });
  }
};
