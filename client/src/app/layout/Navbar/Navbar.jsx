import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../shared/assets/images/logo.png";
import styles from "./Navbar.module.css";
export default function Navbar() {
  return (
    <header className={styles.root}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          <img src={logo} alt="LinkUp Logo" className={styles.logo} />
          <span className={styles.title}>LinkUp</span>
        </Link>
        <div className={styles.guest}>
          <Link to="/signup" className={styles.signUpButton}>
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
