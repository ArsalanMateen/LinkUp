import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./MainRouter";
import { AuthProvider } from "./auth/AuthProvider";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
