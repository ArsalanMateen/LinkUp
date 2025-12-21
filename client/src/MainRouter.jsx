import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home.jsx";
import Users from "./user/Users.jsx";
import Signup from "./user/Signup.jsx";
import Signin from "./auth/Signin.jsx";
import EditProfile from "./user/EditProfile.jsx";
import Profile from "./user/Profile.jsx";
import PrivateRoute from "./auth/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";

const MainRouter = () => {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/users" component={Users} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <Route
          path="/user/:userId"
          render={(props) => (
            <Profile key={props.match.params.userId} {...props} />
          )}
        />
      </Switch>
    </div>
  );
};

export default MainRouter;
