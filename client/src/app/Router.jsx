import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../features/feed/pages/Home/Home.jsx";
export default function MainRouter() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </div>
  );
}
