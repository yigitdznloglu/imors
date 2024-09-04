const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

module.exports = mongoose.model("Song", songSchema);
