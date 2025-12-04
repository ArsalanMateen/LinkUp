import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { signin } from "./api";
import useAction from "../hooks/useAction";
import logoImg from "../assets/images/logo.png";
import styles from "./Signin.module.css";

export default function Signin(props) {
  const auth = useAuth();
  const action = useAction();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  });

  const handleChange = (name) => (event) => {
    setFormState({ ...formState, [name]: event.target.value });
  };

  const login = (credentials) =>
    action.run(async () => {
      const response = await signin(credentials);
      auth.authenticate(response);
      setFormState((previous) => ({ ...previous, redirectToReferrer: true }));
    });
  const clickSubmit = (event) => {
    event.preventDefault();
    login({ email: formState.email, password: formState.password });
  };
  const loginAsDemo = () =>
    login({ email: "emilys@example.com", password: "password" });

  const { from } = (props.location && props.location.state) || {
    from: { pathname: "/" },
  };

  if (formState.redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <div className={styles["signin"]}>
      <div className={styles["signin__card"]}>
        <img
          src={logoImg}
          alt="LinkUp"
          width="48"
          height="48"
          style={{
            width: "48px",
            height: "48px",
            maxWidth: "48px",
            maxHeight: "48px",
            objectFit: "contain",
            marginBottom: "12px",
          }}
          className={styles["signin__logo"]}
        />
        <h1 className={styles["signin__title"]}>Welcome back</h1>
        <p className={styles["signin__subtitle"]}>
          Sign in to your LinkUp account
        </p>

        <form onSubmit={clickSubmit} className={styles["signin__form"]}>
          <div className={styles["signin__input-group"]}>
            <label htmlFor="signin-email" className={styles["signin__label"]}>
              Email Address
            </label>
            <input
              type="email"
              className={styles["signin__input"]}
              placeholder="you@example.com"
              id="signin-email"
              autoComplete="email"
              value={formState.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          <div className={styles["signin__input-group"]}>
            <label
              htmlFor="signin-password"
              className={styles["signin__label"]}
            >
              Password
            </label>
            <input
              type="password"
              className={styles["signin__input"]}
              id="signin-password"
              autoComplete="current-password"
              value={formState.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          {action.error && (
            <div role="alert" className={styles["signin__error"]}>
              {action.error}
            </div>
          )}

          <button
            disabled={action.pending}
            type="submit"
            className={styles["signin__submit-btn"]}
          >
            Sign In
          </button>
        </form>

        <div className={styles["signin__divider"]}>
          <span className={styles["signin__divider-line"]}></span>
          <span className={styles["signin__divider-text"]}>or</span>
          <span className={styles["signin__divider-line"]}></span>
        </div>

        <div className={styles["signin__demo"]}>
          <button
            type="button"
            className={styles["signin__demo-btn"]}
            disabled={action.pending}
            onClick={loginAsDemo}
          >
            Sign in as Emily Johnson
          </button>
        </div>

        <p className={styles["signin__footer"]}>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className={styles["signin__link"]}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
