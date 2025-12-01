import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "./storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => auth.getToken());

  useEffect(() => {
    const refresh = () => setSession(auth.getToken());
    window.addEventListener("auth-session-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("auth-session-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, ...auth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
