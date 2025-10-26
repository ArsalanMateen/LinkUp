import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./Router";
export default function App() {
  return (
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  );
}
