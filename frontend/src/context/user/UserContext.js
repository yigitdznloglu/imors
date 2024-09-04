import React, { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated, getSession, signout } from "../auth/auth";
import { getThisUser } from "../../api/auth";

const UserContext = createContext({ user: null, setUser: () => {} });

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated()) return;
      const token = getSession();
      const userData = await getThisUser(token);
      if (userData) {
        setUser(userData);
      } else {
        console.log(userData);
        signout();
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
