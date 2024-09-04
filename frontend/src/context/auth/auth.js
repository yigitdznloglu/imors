const SESSION_KEY = "jwtToken";

const isAuthenticated = () => {
  const token = localStorage.getItem(SESSION_KEY);
  return !!token;
};

const getSession = () => {
  return localStorage.getItem(SESSION_KEY);
};

const authenticate = (token) => {
  localStorage.setItem(SESSION_KEY, token);
  let storedToken = localStorage.getItem(SESSION_KEY); // Retrieve to verify
};

const signout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export { isAuthenticated, getSession, authenticate, signout };
