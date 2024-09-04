import React from "react";
import "./VideoPlayer.css";

const VideoPlayer = ({ video }) => {
  // TODO: Change iframe src to a link for the song.
  return (
    <div id="video-player">
      <iframe
        width="800"
        height="512"
        src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
