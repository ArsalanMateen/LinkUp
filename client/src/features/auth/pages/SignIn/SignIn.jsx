import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { signin } from "../../api/authApi";
import useAction from "../../../../shared/hooks/useAction";
import logoImg from "../../../../shared/assets/images/logo.png";
import styles from "./SignIn.module.css";

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

  const { from } = (props.location && props.location.state) || {
    from: { pathname: "/" },
  };

  if (formState.redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
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
          className={styles.logo}
        />
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your LinkUp account</p>

        <form onSubmit={clickSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="signin-email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              className={styles.input}
              id="signin-email"
              autoComplete="email"
              value={formState.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="signin-password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              className={styles.input}
              id="signin-password"
              autoComplete="current-password"
              value={formState.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          {action.error && (
            <div role="alert" className={styles.error}>
              {action.error}
            </div>
          )}

          <button
            disabled={action.pending}
            type="submit"
            className={styles.submitButton}
          >
            Sign In
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
