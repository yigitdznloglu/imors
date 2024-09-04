import {
  makeHTTPDELETERequest,
  makeHTTPGETRequest,
  makeHTTPPOSTRequest,
  makeHTTPPUTRequest,
} from "./abstract";

function getURL(endpoint = "") {
  return "users/" + endpoint;
}

export async function createUser(username, email, password) {
  const bodyParams = { username, email, password };
  const endpoint = getURL();
  return makeHTTPPOSTRequest(endpoint, bodyParams).then((response) => {
    const { message, error = "N/A" } = response;
    return { message, error };
  });
}

export async function getUserByEmail(email) {
  const queryParams = { email };
  const endpoint = getURL();
  return makeHTTPGETRequest(endpoint, queryParams).then((response) => {
    const { message, error = "N/A" } = response;
    return { message, error };
  });
}

export async function updateUsername(email, username) {
  const bodyParams = { email, username };
  const endpoint = getURL("updateUsername");
  return makeHTTPPUTRequest(endpoint, bodyParams).then((response) => {
    const { message, error = "N/A" } = response;
    return { message, error };
  });
}

export async function updateEmail(email, username) {
  const bodyParams = { email, username };
  const endpoint = getURL("updateEmail");
  return makeHTTPPUTRequest(endpoint, bodyParams).then((response) => {
    const { message, error = "N/A" } = response;
    return { message, error };
  });
}

export async function changePassword(email, password) {
  const bodyParams = { email, password };
  const endpoint = getURL("changePassword");
  return makeHTTPPUTRequest(endpoint, bodyParams).then((response) => {
    const { message, error = "N/A" } = response;
    return { message, error };
  });
}

export async function deleteUser(email) {
  const queryParams = { email };
  const endpoint = getURL();
  return makeHTTPDELETERequest(endpoint, queryParams).then((response) => {
    const { message, error = "N/A" } = response;
    return { message, error };
  });
}
