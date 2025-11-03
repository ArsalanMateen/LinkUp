import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./Router";
import { AuthProvider } from "../features/auth/context/AuthProvider";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
