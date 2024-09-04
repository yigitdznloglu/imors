import { makeHTTPPOSTRequest, makeHTTPGETRequest } from "./abstract";

function getURL(endpoint = "") {
  return "auth/" + endpoint;
}

export async function login(email, password) {
  const queryParams = { email, password };
  const endpoint = getURL();
  return makeHTTPPOSTRequest(endpoint, queryParams).then((response) => {
    // const token = response.token;
    // localStorage.setItem("jwtToken", token);
    return response;
  });
}

export async function getThisUser() {
  const endpoint = getURL();
  return makeHTTPGETRequest(endpoint).then((response) => {
    return response;
  });
}
