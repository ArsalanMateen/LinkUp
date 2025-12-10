import React from "react";
import { Link, withRouter } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import styles from "./Sidebar.module.css";
import { HomeRounded as HomeIcon } from "../Icons";
import { PeopleAltOutlined as GroupIcon } from "../Icons";
import { PersonOutline as PersonIcon } from "../Icons";
import { ExitToApp as ExitToAppIcon } from "../Icons";

const Sidebar = withRouter(({ history, onNavigateDiscover }) => {
  const auth = useAuth();
  const currentPath = history.location.pathname;
  const authSession = auth.session;

  const handleSignout = () => {
    auth.clearJWT(() => history.push("/"));
  };

  const handleDiscoverClick = (e) => {
    if (currentPath === "/" && onNavigateDiscover) {
      e.preventDefault();
      onNavigateDiscover();
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__nav}>
        <Link
          to="/"
          className={`${styles.sidebar__item} ${currentPath === "/" ? styles["sidebar__item--active"] : ""}`}
        >
          <HomeIcon className={styles.sidebar__icon} />
          <span>Home</span>
        </Link>

        <Link
          to="/users"
          onClick={handleDiscoverClick}
          className={`${styles.sidebar__item} ${currentPath === "/users" ? styles["sidebar__item--active"] : ""}`}
        >
          <GroupIcon className={styles.sidebar__icon} />
          <span>Discover People</span>
        </Link>

        {authSession && authSession.user && (
          <Link
            to={`/user/${authSession.user._id}`}
            className={`${styles.sidebar__item} ${currentPath.startsWith("/user/") ? styles["sidebar__item--active"] : ""}`}
          >
            <PersonIcon className={styles.sidebar__icon} />
            <span>Profile</span>
          </Link>
        )}

        <div className={styles.sidebar__divider} />

        {authSession ? (
          <button
            type="button"
            onClick={handleSignout}
            className={styles.sidebar__item}
          >
            <ExitToAppIcon className={styles.sidebar__icon} />
            <span>Sign out</span>
          </button>
        ) : (
          <Link to="/signin" className={styles.sidebar__item}>
            <ExitToAppIcon className={styles.sidebar__icon} />
            <span>Sign in</span>
          </Link>
        )}
      </div>
    </aside>
  );
});

export default Sidebar;
