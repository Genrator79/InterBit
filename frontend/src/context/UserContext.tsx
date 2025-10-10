// src/context/UserContext.tsx
"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null | undefined; // undefined = loading
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
  logout: () => {},
});

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Sync user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Helper to log out
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
