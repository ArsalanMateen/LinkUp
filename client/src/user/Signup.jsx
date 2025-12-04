import React, { useState } from "react";
import { Link } from "react-router-dom";
import { create } from "./api";
import useAction from "../hooks/useAction";
import logoImg from "../assets/images/logo.png";
import styles from "./Signup.module.css";

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
    <div className={styles["signup"]}>
      <div className={styles["signup__card"]}>
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
          className={styles["signup__logo"]}
        />
        <h1 className={styles["signup__title"]}>Join LinkUp</h1>
        <p className={styles["signup__subtitle"]}>
          Connect with friends, colleagues, and thinkers
        </p>

        {formState.open ? (
          <div className={styles["signup__success"]}>
            <h2 className={styles["signup__success-title"]}>
              Account Created!
            </h2>
            <p className={styles["signup__success-text"]}>
              Your account has been successfully created. You can now sign in.
            </p>
            <Link to="/signin" className={styles["signup__btn--signin"]}>
              Explore LinkUp
            </Link>
          </div>
        ) : (
          <form onSubmit={clickSubmit} className={styles["signup__form"]}>
            <div className={styles["signup__input-group"]}>
              <label htmlFor="signup-name" className={styles["signup__label"]}>
                Full Name
              </label>
              <input
                type="text"
                className={styles["signup__input"]}
                placeholder="Alex Chen"
                id="signup-name"
                autoComplete="name"
                value={formState.name}
                onChange={handleChange("name")}
                required
              />
            </div>

            <div className={styles["signup__input-group"]}>
              <label htmlFor="signup-email" className={styles["signup__label"]}>
                Email Address
              </label>
              <input
                type="email"
                className={styles["signup__input"]}
                placeholder="you@example.com"
                id="signup-email"
                autoComplete="email"
                value={formState.email}
                onChange={handleChange("email")}
                required
              />
            </div>

            <div className={styles["signup__input-group"]}>
              <label
                htmlFor="signup-password"
                className={styles["signup__label"]}
              >
                Password
              </label>
              <input
                type="password"
                className={styles["signup__input"]}
                id="signup-password"
                autoComplete="new-password"
                value={formState.password}
                onChange={handleChange("password")}
                required
              />
            </div>

            {action.error && (
              <div role="alert" className={styles["signup__error"]}>
                {action.error}
              </div>
            )}

            <button
              disabled={action.pending}
              type="submit"
              className={styles["signup__submit-btn"]}
            >
              Create Account
            </button>
          </form>
        )}

        {!formState.open && (
          <p className={styles["signup__footer"]}>
            Already have an account?{" "}
            <Link to="/signin" className={styles["signup__link"]}>
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
