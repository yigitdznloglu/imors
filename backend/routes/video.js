const express = require("express");
const router = express.Router();
const videoController = require("../controllers/video");

// router.get("/:songId", videoController.getSongVideos);

router.post("/generate", videoController.generateVideo);
router.get("/getURLs", videoController.getVideoURLs);
router.delete("/:videoId", videoController.deleteVideo);

module.exports = router;
