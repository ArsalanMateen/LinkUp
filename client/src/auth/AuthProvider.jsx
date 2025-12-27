import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "./storage";
import { sessionExpiry } from "./session";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => auth.getToken());
  useEffect(() => {
    const refresh = () => setSession(auth.getToken());
    const expired = (event) => {
      if (auth.getToken()?.token === event.detail?.token) auth.clearLocal();
    };
    window.addEventListener("auth-session-changed", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("auth-session-expired", expired);
    return () => {
      window.removeEventListener("auth-session-changed", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("auth-session-expired", expired);
    };
  }, []);
  useEffect(() => {
    if (!session) return;
    const expiry = sessionExpiry(session);
    if (expiry === null) return;
    let timer;
    const check = () => {
      const delay = expiry - Date.now();
      if (delay <= 0) auth.clearLocal();
      else timer = setTimeout(check, Math.min(delay, 2147483647));
    };
    check();
    return () => clearTimeout(timer);
  }, [session]);
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
