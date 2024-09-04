const { getDownloadURL, ref } = require("firebase/storage");
const { bucket } = require("../firebase-config");
const fs = require("fs");
const https = require("https");
const Song = require("../models/song");
const Video = require("../models/video");
const path = require("path");
const os = require("os");
const { getUserFromRequest } = require("../utils/auth");
const { Queue } = require("bullmq");
const dotenv = require("dotenv");
dotenv.config();

const baseVideoDirectory = process.env.BASE_VIDEO_DIRECTORY;

// Set up BullMQ queue
const songQueue = new Queue("songProcessing", {
  connection: {
    host: "localhost",
    port: 6379
  },
});

exports.generateVideo = async (req, res, next) => {
  try {
    console.log("Starting the video generation process.");
    const user = await getUserFromRequest(req);
    if (!user) {
      console.log("User not found!");
      return res.status(404).json({ message: "User not found!" });
    }

    console.log("User found:", user._id);
    const songId = req.body.songId;
    const song = await Song.findOne({ _id: songId });
    if (!song) {
      console.log("Song not found with ID:", songId);
      return res.status(404).json({ message: "Song not found!" });
    }

    console.log("Song found:", song.title);
    const model = req.body.model;
    const video = new Video({ song: song._id, model: model });
    await video.save();
    console.log("Video entry created in database.");
    song.videos.push(video._id);
    await song.save();
    console.log("Video ID added to the song's videos field.");

    const fileRef = bucket.file(`${song.owner}/${song._id}/${video._id}`);
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });
    console.log("Download URL obtained:", url);

    const videoDirectory = path.join(
      baseVideoDirectory,
      song.owner.toString(),
      song._id.toString(),
      "videos"
    );
    console.log("Video directory path:", videoDirectory);
    await fs.promises.mkdir(videoDirectory, { recursive: true });
    console.log("Video directory ensured.");

    // Add the video generation task to the queue
    await songQueue.add("processSong", {
      filename: "video",
      modelName: model,
      userId: song.owner,
      song: song,
      videoId: video._id,
      userEmail: user.email,
    });
    console.log("Video generation task queued.");

    res.status(200).json({
      message: "Video is queued",
      song: song,
    });
  } catch (err) {
    console.error("Error in generateVideo function:", err);
    res.status(500).json({
      message: "Failed to queue video!",
      error: err.message,
    });
  }
};

exports.getVideoURLs = async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  const songId = req.query.songId;
  const song = await Song.findOne({ _id: songId });
  if (!song) {
    return res.status(404).json({ message: "Song not found!" });
  }

  const directory = `${song.owner}/${song._id}/`;

  try {
    const options = { prefix: directory };
    const [files] = await bucket.getFiles(options);
    const videoURLPromises = files
      .filter((file) => !file.name.endsWith(song._id))
      .map((file) =>
        file
          .getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          })
          .then((urlArray) => ({
            url: urlArray[0],
            id: file.name
              .split("/")
              .pop()
              .replace(/\.mp4$/, ""), // Removes the .mp4 extension from the filename
          }))
      );

    const videos = await Promise.all(videoURLPromises);
    res.json(videos);
  } catch (error) {
    console.error("Error fetching video URLs:", error);
    res.status(500).json({ message: "Failed to fetch video URLs" });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found!" });
    }

    // Construct the file path using video ID
    const filePath = `${user._id}/${video.song}/${videoId}.mp4`; // Ensure the video file naming convention follows this pattern
    const fileRef = bucket.file(filePath);

    // Delete the video file from Firebase storage
    await fileRef.delete();
    console.log("Video file deleted successfully from Firebase storage.");

    // Delete the video document from database
    await Video.findByIdAndDelete(videoId);
    // Update the song document by pulling the video reference from its videos array
    await Song.findByIdAndUpdate(video.song, { $pull: { videos: video._id } });

    res.json({
      message: "Video is deleted successfully from database and storage.",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to delete video.", error: err.message });
  }
};
