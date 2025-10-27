import React, { useState } from "react";
import styles from "./SignUp.module.css";
export default function Signup() {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Join LinkUp</h1>
        <form className={styles.form}>
          {["name", "email", "password"].map((name) => (
            <div key={name} className={styles.inputGroup}>
              <label htmlFor={name} className={styles.label}>
                {name}
              </label>
              <input
                id={name}
                type={name === "name" ? "text" : name}
                value={values[name]}
                onChange={(event) =>
                  setValues({ ...values, [name]: event.target.value })
                }
                required
                className={styles.input}
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}
