import React, { useState } from "react";
import styles from "./SignIn.module.css";
export default function Signin() {
  const [values, setValues] = useState({ email: "", password: "" });
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <form className={styles.form}>
          {["email", "password"].map((name) => (
            <div className={styles.inputGroup} key={name}>
              <label htmlFor={name} className={styles.label}>
                {name}
              </label>
              <input
                id={name}
                type={name}
                required
                value={values[name]}
                onChange={(e) =>
                  setValues({ ...values, [name]: e.target.value })
                }
                className={styles.input}
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}
