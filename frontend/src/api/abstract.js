const API_URL = process.env.REACT_APP_API_URL;

export function makeHTTPGETRequest(endpoint, queryParams = {}) {
  const token = localStorage.getItem("jwtToken");
  const url = new URL(API_URL + endpoint);

  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

export async function makeHTTPPOSTRequest(endpoint, bodyParams = {}) {
  // Retrieve the JWT token from local storage
  const token = localStorage.getItem("jwtToken");

  // Construct the full URL for the request
  const url = new URL(API_URL + endpoint);
  console.log(`Making POST request to: ${url}`);

  // Setup headers including the authorization header
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  // Configure the fetch options
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(bodyParams),
  };

  // Perform the fetch operation
  try {
    const response = await fetch(url, options);
    // Check if the response is successful
    if (!response.ok) {
      // You can handle HTTP specific errors here
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function makeHTTPPUTRequest(endpoint, bodyParams) {
  const token = localStorage.getItem("jwtToken");
  console.log(API_URL + endpoint);
  const url = new URL(API_URL + endpoint);
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const options = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(bodyParams),
  };

  return fetch(url, options)
    .then((response) => {
      console.log(response);
      return response.body;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
}

export function makeHTTPDELETERequest(endpoint, queryParams = {}) {
  const token = localStorage.getItem("jwtToken");
  console.log(API_URL + endpoint);
  const url = new URL(API_URL + endpoint);

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const options = {
    method: "DELETE",
    headers: headers,
  };

  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return fetch(url, options)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
}

export async function makeHTTPUploadRequest(endpoint, formData, headers = {}) {
  const url = new URL(API_URL + endpoint);

  const token = localStorage.getItem("jwtToken");
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    body: formData,
  };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Upload error:", error);
      throw error;
    });
}
