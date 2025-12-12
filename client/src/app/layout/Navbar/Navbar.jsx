import React, { lazy, Suspense, useState, useEffect, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import { useAuth } from "../../../features/auth/context/AuthProvider";
import { Avatar } from "../../../shared/ui";
import logoImg from "../../../shared/assets/images/logo.png";
import styles from "./Navbar.module.css";
import { PersonOutline as PersonIcon } from "../../../shared/ui/Icons/Icons";
import { ExitToApp as ExitToAppIcon } from "../../../shared/ui/Icons/Icons";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "../../../shared/ui/Icons/Icons";
import { DeleteOutline as DeleteOutlineIcon } from "../../../shared/ui/Icons/Icons";
import RequestState from "../../../shared/ui/RequestState/RequestState";

const DeleteAccountDialog = lazy(() => import("../../../features/users/components/DeleteAccountDialog/DeleteAccountDialog"));

const Navbar = withRouter(({ history }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const auth = useAuth();

  const authSession = auth.session;

  const dropdownRef = useRef(null);

  useEffect(() => {
    setDropdownOpen(false);
    setDeleteUserId(null);
  }, [authSession?.user?._id]);

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
    <header className={styles.root}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
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
            className={styles.logo}
          />
          <span className={styles.title}>LinkUp</span>
        </Link>

        <div className={styles.userArea} ref={dropdownRef}>
          {hasValidSession ? (
            <>
              <button
                type="button"
                className={styles.profileButton}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <Avatar user={authSession.user} size="sm" />
                <span className={styles.userName}>
                  {authSession.user.name}
                </span>
                <KeyboardArrowDownIcon
                  className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <Link
                    to={`/user/${authSession.user._id}`}
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <PersonIcon fontSize="small" />
                    <span>View Profile</span>
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button
                    type="button"
                    className={`${styles.dropdownItem} ${styles.dropdownSignOut}`}
                    onClick={() => {
                      setDropdownOpen(false);
                      setDeleteUserId(authSession.user._id);
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                    <span>Delete Account</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.dropdownItem} ${styles.dropdownSignOut}`}
                    onClick={handleSignout}
                  >
                    <ExitToAppIcon fontSize="small" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.guest}>
              <Link to="/signin" className={styles.signInButton}>
                Sign In
              </Link>
              <Link to="/signup" className={styles.signUpButton}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
      {hasValidSession && deleteUserId === authSession.user._id && (
        <Suspense fallback={<RequestState loading />}>
          <DeleteAccountDialog
            key={deleteUserId}
            isOpen
            userId={deleteUserId}
            onClose={() => setDeleteUserId(null)}
            onDeleted={() => {
              setDeleteUserId(null);
              history.push("/");
            }}
          />
        </Suspense>
      )}
    </header>
  );
});

export default Navbar;
