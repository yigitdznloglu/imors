const Session = require("../models/session");
const User = require("../models/user");
const { JWT_SECRET } = require("../secret/secret");
const jwt = require("jsonwebtoken");

const getUserFromRequest = async (req) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    console.log("USERRRRR:", userId);

    // Find the user associated with the userId from the token
    const user = await User.findById(userId);
    console.log("USEROBJ", user);
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    // Handle errors (e.g., token expired, invalid token)
    console.error(error);
    return null;
  }
};

const verifyUserOwnership = (user, song) => {
  return song.owner.toString() === user._id.toString();
};

module.exports = { getUserFromRequest, verifyUserOwnership };
