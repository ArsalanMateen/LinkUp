import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";

export default function MainRouter() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  );
}
