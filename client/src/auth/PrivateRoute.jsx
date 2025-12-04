import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./AuthProvider";
export default function PrivateRoute({ component: Component, ...rest }) {
  const { session } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        session ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    />
  );
}
