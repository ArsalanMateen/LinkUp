import React from "react";
import { Link, withRouter } from "react-router-dom";
import { useAuth } from "../../../features/auth/context/AuthProvider";
import styles from "./Sidebar.module.css";
import { HomeRounded as HomeIcon } from "../../../shared/ui/Icons/Icons";
import { PeopleAltOutlined as GroupIcon } from "../../../shared/ui/Icons/Icons";
import { PersonOutline as PersonIcon } from "../../../shared/ui/Icons/Icons";
import { ExitToApp as ExitToAppIcon } from "../../../shared/ui/Icons/Icons";

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
    <aside className={styles.root}>
      <div className={styles.nav}>
        <Link
          to="/"
          className={`${styles.item} ${currentPath === "/" ? styles.itemActive : ""}`}
        >
          <HomeIcon className={styles.icon} />
          <span>Home</span>
        </Link>

        <Link
          to="/users"
          onClick={handleDiscoverClick}
          className={`${styles.item} ${currentPath === "/users" ? styles.itemActive : ""}`}
        >
          <GroupIcon className={styles.icon} />
          <span>Discover People</span>
        </Link>

        {authSession && authSession.user && (
          <Link
            to={`/user/${authSession.user._id}`}
            className={`${styles.item} ${currentPath.startsWith("/user/") ? styles.itemActive : ""}`}
          >
            <PersonIcon className={styles.icon} />
            <span>Profile</span>
          </Link>
        )}

        <div className={styles.divider} />

        {authSession ? (
          <button
            type="button"
            onClick={handleSignout}
            className={`${styles.item} ${styles.itemSignout}`}
          >
            <ExitToAppIcon className={styles.icon} />
            <span>Sign out</span>
          </button>
        ) : (
          <Link to="/signin" className={styles.item}>
            <ExitToAppIcon className={styles.icon} />
            <span>Sign in</span>
          </Link>
        )}
      </div>
    </aside>
  );
});

export default Sidebar;
