const getAudioPath = (song) => {
  return `${song.owner._id}/${song._id}/`;
};

const getVideoPathForSong = (song) => {
  return `${song.owner._id}/${song._id}/videos`;
};

const getVideoPath = (video) => {
  return `${video.song.owner._id}/${video.song._id}/videos/${video._id}`;
};

module.exports = { getAudioPath, getVideoPathForSong, getVideoPath };
