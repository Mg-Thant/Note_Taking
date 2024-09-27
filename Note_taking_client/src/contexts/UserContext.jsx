import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? JSON.parse(storedToken) : null;
  });

  const updatedToken = (JWTtoken) => {
    const token = JSON.stringify(JWTtoken);
    localStorage.setItem("token", token);
    setToken(JWTtoken);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(JSON.parse(storedToken));
    }
  }, []);

  return (
    <UserContext.Provider value={{ token, updatedToken }}>
      {children}
    </UserContext.Provider>
  );
};
