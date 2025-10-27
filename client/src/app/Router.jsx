import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../features/feed/pages/Home/Home.jsx";
import Signup from "../features/auth/pages/SignUp/SignUp.jsx";
export default function MainRouter() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
      </Switch>
    </div>
  );
}
