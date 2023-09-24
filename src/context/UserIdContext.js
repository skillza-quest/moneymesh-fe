import React, { createContext, useContext, useState, useEffect } from "react";

const UserIdContext = createContext();

export const useUserId = () => {
  const context = useContext(UserIdContext);
  if (!context) {
    throw new Error("useUserId must be used within a UserIdProvider");
  }
  return context;
};

export const UserIdProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  useEffect(() => {
    // Whenever userId changes, update it in localStorage
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};
