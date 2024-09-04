const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { storage } = require("../firebase-config.js");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const Song = require("../models/song.js");
const Video = require("../models/video.js");
const User = require("../models/user.js"); // Make sure to import the User model
const Session = require("../models/session.js"); // Make sure to import the Session model
const { deleteObject } = require("firebase/storage");
const { getUserFromRequest } = require("../utils/auth.js");

const { bucket } = require("../firebase-config.js"); // Import the initialized bucket

exports.createSong = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No audio file provided!",
      });
    }

    const audioFile = req.file;
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    const song = new Song({
      title: audioFile.originalname,
      owner: user._id,
    });
    await song.save(); // Save first to ensure song._id is generated

    const fileRef = bucket.file(`${user._id}/${song._id}/${song._id}`);

    const stream = fileRef.createWriteStream({
      metadata: {
        contentType: audioFile.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("File upload error:", err);
      res.status(500).json({
        message: "Failed to upload song!",
        error: err.message,
      });
    });

    stream.on("finish", async () => {
      // Make the file publicly accessible (if necessary)
      await fileRef.makePublic();

      // Update user's song list
      user.songs.push(song._id);
      await user.save();

      res.status(200).json({
        message: "Song uploaded and created successfully!",
        song: song,
      });
    });

    // Pipe the audio file buffer to the stream
    stream.end(audioFile.buffer);
  } catch (err) {
    console.log("Error processing upload:", err);
    res.status(500).json({
      message: "Failed to create song!",
      error: err.message,
    });
  }
};

exports.getUserSongs = async (req, res, next) => {
  try {
    // Get the user
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    console.log("USER_NEW:", user);

    // Find all songs belonging to the user
    const songs = await Song.find({ owner: user._id });

    // Use Promise.all to fetch all videos for each song concurrently
    const songsWithVideos = await Promise.all(
      songs.map(async (song) => {
        const videos = await Video.find({ song: song._id });
        const videoIds = videos.map((video) => video._id.toString()); // Map to video IDs
        return {
          _id: song._id,
          title: song.title,
          videos: videoIds,
        };
      })
    );

    return res.status(200).json({
      message: "Songs and videos retrieved successfully!",
      songs: songsWithVideos,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to retrieve songs!",
      error: err.message,
    });
  }
};

exports.getSongFile = async (req, res, next) => {
  try {
    const songId = req.params.songId;
    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({
        message: "Song not found!",
      });
    }

    // Get the session ID from the cookie
    const sessionId = req.cookies.sessionId;
    const session = await Session.findOne({ sessionId: sessionId });
    if (!session) {
      return res.status(404).json({
        message: "Session not found!",
      });
    }

    // Get the user
    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    // Check if the user owns the song
    if (song.owner.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "You do not have permission to access this song!",
      });
    }

    // Create a reference to the file in Firebase Storage
    const fileRef = ref(storage, `audioFiles/${user._id}/${song.title}`);

    // Get the download URL for the file
    const downloadUrl = await getDownloadURL(fileRef);

    // Redirect the user to the download URL
    res.redirect(downloadUrl);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to retrieve song file!",
      error: err.message,
    });
  }
};

// controllers/song.js

exports.deleteSong = async (req, res) => {
  try {
    const songId = req.params.songId;
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found!" });
    }

    const user = await getUserFromRequest(req);
    if (!user || song.owner.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this song." });
    }

    // Delete all related video documents
    await Video.deleteMany({ song: song._id });
    console.log("All related videos deleted successfully.");

    // Delete the song document
    await Song.findByIdAndDelete(songId);
    await User.findByIdAndUpdate(user._id, { $pull: { songs: songId } });

    // Delete the entire folder from Firebase storage
    const folderRef = bucket.file(`${user._id}/${song._id}/`);
    const [files] = await bucket.getFiles({ prefix: folderRef.name });
    files.forEach(async (file) => {
      await file.delete();
    });
    console.log("Song folder deleted successfully from Firebase storage.");

    res.json({
      message:
        "Song and all related videos deleted successfully from database and storage.",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to delete song.", error: err.message });
  }
};
