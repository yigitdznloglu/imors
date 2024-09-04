const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const songController = require("../controllers/song");

router.post("", upload.single("audioFile"), songController.createSong);

router.get("/all", songController.getUserSongs);

router.get("/:songId", songController.getSongFile);

router.delete("/:songId", songController.deleteSong);

module.exports = router;
