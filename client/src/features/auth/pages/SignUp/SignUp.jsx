import React, { useState } from "react";
import { Link } from "react-router-dom";
import { create } from "../../../users/api/usersApi";
import useAction from "../../../../shared/hooks/useAction";
import logoImg from "../../../../shared/assets/images/logo.png";
import styles from "./SignUp.module.css";

export default function Signup() {
  const action = useAction();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    open: false,
    error: "",
  });

  const handleChange = (name) => (event) => {
    setFormState({ ...formState, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    action.run(async () => {
      await create({
        name: formState.name,
        email: formState.email,
        password: formState.password,
      });
      setFormState((previous) => ({ ...previous, open: true }));
    });
  };

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
        <h1 className={styles.title}>Join LinkUp</h1>
        <p className={styles.subtitle}>
          Connect with friends, colleagues, and thinkers
        </p>

        {formState.open ? (
          <div className={styles.success}>
            <h2 className={styles.successTitle}>
              Account Created!
            </h2>
            <p className={styles.successText}>
              Your account has been successfully created. You can now sign in.
            </p>
            <Link to="/signin" className={styles.signInButton}>
              Explore LinkUp
            </Link>
          </div>
        ) : (
          <form onSubmit={clickSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="signup-name" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                className={styles.input}
                id="signup-name"
                autoComplete="name"
                value={formState.name}
                onChange={handleChange("name")}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="signup-email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                className={styles.input}
                id="signup-email"
                autoComplete="email"
                value={formState.email}
                onChange={handleChange("email")}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label
                htmlFor="signup-password"
                className={styles.label}
              >
                Password
              </label>
              <input
                type="password"
                className={styles.input}
                id="signup-password"
                autoComplete="new-password"
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
              Create Account
            </button>
          </form>
        )}

        {!formState.open && (
          <p className={styles.footer}>
            Already have an account?{" "}
            <Link to="/signin" className={styles.link}>
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
