import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../features/feed/pages/Home/Home.jsx";
import Signup from "../features/auth/pages/SignUp/SignUp.jsx";
import Signin from "../features/auth/pages/SignIn/SignIn.jsx";
import Profile from "../features/users/pages/Profile/Profile.jsx";
import Users from "../features/users/pages/Users/Users.jsx";
import EditProfile from "../features/users/pages/EditProfile/EditProfile.jsx";
import Navbar from "./layout/Navbar/Navbar";
import PrivateRoute from "../features/auth/components/PrivateRoute";
export default function MainRouter() {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
        <Route exact path="/user/:userId" component={Profile} />
      </Switch>
    </div>
  );
}
