const User = require("../models/user");
const { generateSalt, hash, compare } = require("../utils/salt.js");

// Create a new user (makes a hash for the password)
exports.createUser = async (req, res, next) => {
  let hashedPassword;
  try {
    hashedPassword = hash(req.body.password);
  } catch (err) {
    return res.status(500).json({
      message: "Failed Password Encryption",
    });
  }

  try {
    const foundUser = await User.findOne({ email: req.body.email });
    if (foundUser) {
      return res.status(500).json({
        message: "User already exists.",
      });
    }
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    });

    const result = await user.save();

    // Send a single response here
    return res.status(201).json({
      message: "User added successfully",
      post: {
        ...result.toObject(),
        id: result._id,
      },
    });
  } catch (err) {
    console.log(err);

    // Send a single error response here
    return res.status(500).json({
      message: "Failed to create user!",
      error: err.message,
    });
  }
};

// Delete a user by ID
exports.deleteUser = (req, res, next) => {
  const userId = req.params.id;
  let userSave;
  User.find
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }

      // Check if the user has the necessary credentials to delete the user
      if (user._id.toString() !== req.TokenUserId) {
        throw new Error("Invalid Credentials");
      }
      userSave = user;
      // If the user has the credentials, proceed with user deletion
      return User.findByIdAndRemove(userId);
    })
    .then(() => {
      res.json({
        message: "User deleted successfully",
        user: userSave,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: err.message || "User not found or invalid credentials!",
      });
    });
};

// Get a user by email (using a query parameter)
exports.getUserByEmail = (req, res, next) => {
  const email = req.query.email;
  console.log(email);
  User.findOne({ email })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        user: { ...user._doc },
        status: "Success",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: err.message || "User not found!",
      });
    });
};

exports.updateUsername = async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  // try {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.username = username;
    console.log(user.username);
    await user.save();
    res.status(200).json({
      message: "Username updated successfully!",
      user: {
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message || "Failed to update username!",
    });
  }
};

exports.updateEmail = async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  // try {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.email = email;
    console.log(user.email);
    await user.save();
    res.status(200).json({
      message: "Email updated successfully!",
      user: {
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message || "Failed to update username!",
    });
  }
};

// Update a user's password by email
exports.uploadSong = async (req, res) => {
  try {
    await uploadFileToFirebase(req.file.buffer, req.file.originalname);
    res.send({ message: "Song uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to upload song" });
  }
};

exports.changePasswordByEmail = async (req, res, next) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }

    // Check if a new password is provided and it's different from the existing one
    if (req.body.password && req.body.password !== user.password) {
      // Check if the provided password is not already hashed
      let match = await compare(req.body.password, user.password);
      if (!match) {
        let salt = generateSalt(10);
        let hashedpassword = hash(req.body.password, salt);
        user.password = hashedpassword;
      }
    } else {
      throw new Error(
        "No new password provided or password is the same as the old one."
      );
    }

    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message || "Failed to update password!",
      email: email,
    });
  }
};
