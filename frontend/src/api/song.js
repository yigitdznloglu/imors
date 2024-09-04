import { makeHTTPUploadRequest, makeHTTPGETRequest } from "./abstract";
import { makeHTTPDELETERequest } from "./abstract";
function getURL(endpoint = "") {
  return "songs/" + endpoint;
}

export async function uploadSong(file) {
  const formData = new FormData();
  formData.append("audioFile", file);

  const endpoint = getURL();

  return makeHTTPUploadRequest(endpoint, formData).then((response) => {
    const { message, error = "N/A" } = response;
    return { message, error };
  });
}

export async function getUserSongs() {
  const endpoint = "songs/all";

  return makeHTTPGETRequest(endpoint).then((response) => {
    const { songs, error = "N/A" } = response;
    return { songs, error };
  });
}
export async function deleteSong(songId) {
  const endpoint = getURL(`${songId}`);
  return makeHTTPDELETERequest(endpoint)
    .then((response) => {
      console.log("Song deleted successfully:", response);
    })
    .catch((error) => {
      console.error("Failed to delete song:", error);
    });
}
export async function getUserHistory() {
  const endpoint = "songs/history";
  return makeHTTPGETRequest(endpoint).then((response) => {
    return response;
  });
}
