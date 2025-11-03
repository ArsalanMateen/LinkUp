import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../features/feed/pages/Home/Home.jsx";
import Signup from "../features/auth/pages/SignUp/SignUp.jsx";
import Signin from "../features/auth/pages/SignIn/SignIn.jsx";
import Navbar from "./layout/Navbar/Navbar";
export default function MainRouter() {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
      </Switch>
    </div>
  );
}
