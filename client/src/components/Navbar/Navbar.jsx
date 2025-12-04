import React, { useState, useEffect, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { Avatar } from "../common";
import logoImg from "../../assets/images/logo.png";
import styles from "./Navbar.module.css";
import { PersonOutline as PersonIcon } from "../Icons";
import { ExitToApp as ExitToAppIcon } from "../Icons";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "../Icons";

const Navbar = withRouter(({ history }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const auth = useAuth();
  const authSession = auth.session;
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, []);

  const handleSignout = () => {
    setDropdownOpen(false);
    auth.clearJWT(() => history.push("/"));
  };

  const hasValidSession = Boolean(authSession?.user?._id);

  return (
    <header className={styles.navbar}>
      <div className={styles.navbar__container}>
        <Link to="/" className={styles.navbar__brand}>
          <img
            src={logoImg}
            alt="LinkUp Logo"
            width="36"
            height="36"
            style={{
              width: "36px",
              height: "36px",
              maxWidth: "36px",
              maxHeight: "36px",
              objectFit: "contain",
              display: "block",
              marginRight: "12px",
              flexShrink: 0,
            }}
            className={styles.navbar__logo}
          />
          <span className={styles.navbar__title}>LinkUp</span>
        </Link>

        <div className={styles["navbar__user-area"]} ref={dropdownRef}>
          {hasValidSession ? (
            <>
              <button
                type="button"
                className={styles["navbar__profile-btn"]}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <Avatar user={authSession.user} size="sm" />
                <span className={styles["navbar__user-name"]}>
                  {authSession.user.name}
                </span>
                <KeyboardArrowDownIcon
                  className={`${styles.navbar__chevron} ${dropdownOpen ? styles["navbar__chevron--open"] : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className={styles.navbar__dropdown}>
                  <Link
                    to={`/user/${authSession.user._id}`}
                    className={styles["navbar__dropdown-item"]}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <PersonIcon fontSize="small" />
                    <span>View Profile</span>
                  </Link>
                  <div className={styles["navbar__dropdown-divider"]} />
                  <button
                    type="button"
                    className={`${styles["navbar__dropdown-item"]} ${styles["navbar__dropdown-signout"]}`}
                    onClick={handleSignout}
                  >
                    <ExitToAppIcon fontSize="small" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.navbar__guest}>
              <Link to="/signin" className={styles["navbar__btn--outline"]}>
                Sign In
              </Link>
              <Link to="/signup" className={styles["navbar__btn--filled"]}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

export default Navbar;
