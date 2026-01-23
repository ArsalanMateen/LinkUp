import React, { lazy, Suspense } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import Home from "../features/feed/pages/Home/Home.jsx";
import PrivateRoute from "../features/auth/components/PrivateRoute";
import Navbar from "./layout/Navbar/Navbar";
import RequestState from "../shared/ui/RequestState/RequestState";
import RouteErrorBoundary from "./RouteErrorBoundary";

const Users = lazy(() => import("../features/users/pages/Users/Users.jsx"));
const Signup = lazy(() => import("../features/auth/pages/SignUp/SignUp.jsx"));
const Signin = lazy(() => import("../features/auth/pages/SignIn/SignIn.jsx"));
const EditProfile = lazy(() => import("../features/users/pages/EditProfile/EditProfile.jsx"));
const Profile = lazy(() => import("../features/users/pages/Profile/Profile.jsx"));

const MainRouter = () => {
  const location = useLocation();

  return (
    <div>
      <Navbar />
      <RouteErrorBoundary key={location.pathname}>
        <Suspense fallback={<RequestState loading />}>
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
        </Suspense>
      </RouteErrorBoundary>
    </div>
  );
};

export default MainRouter;
