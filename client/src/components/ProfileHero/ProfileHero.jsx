import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../auth/AuthProvider";
import { getHandle } from "../../utils/format";
import { Avatar, Button, Card } from "../common";
import styles from "./ProfileHero.module.css";
import { CalendarTodayOutlined as CalendarTodayOutlinedIcon } from "../Icons";
import { MoreHoriz as MoreHorizIcon } from "../Icons";
import { DeleteOutline as DeleteOutlineIcon } from "../Icons";

export default function ProfileHero({
  user,
  postsCount,
  isOwner,
  isFollowing,
  pending,
  onFollowToggle,
  onOpenDelete,
  onOpenFollowList,
}) {
  const auth = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  const authSession = auth.session;
  const currentUserId =
    authSession && authSession.user ? String(authSession.user._id) : null;
  const targetUserId = user && user._id ? String(user._id) : null;
  const isActualOwner = Boolean(
    isOwner ||
    (currentUserId && targetUserId && currentUserId === targetUserId),
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowOptions(false);
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

  const formattedJoinedDate = user.created
    ? `Joined ${new Date(user.created).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
    : "Joined 2024";

  const followingCount = user.following ? user.following.length : 0;
  const followersCount = user.followers ? user.followers.length : 0;

  return (
    <Card padding="lg" className={styles["profile-hero"]}>
      <div className={styles["profile-hero__top"]}>
        <div className={styles["profile-hero__left"]}>
          <Avatar user={user} size="xl" />
          <div className={styles["profile-hero__meta"]}>
            <h1 className={styles["profile-hero__name"]}>{user.name}</h1>
            <span className={styles["profile-hero__handle"]}>
              {getHandle(user)}
            </span>
            <div className={styles["profile-hero__joined"]}>
              <CalendarTodayOutlinedIcon
                className={styles["profile-hero__calendar-icon"]}
              />
              <span>{formattedJoinedDate}</span>
            </div>
          </div>
        </div>

        <div className={styles["profile-hero__actions"]}>
          {isActualOwner ? (
            <div className={styles["profile-hero__options"]} ref={optionsRef}>
              <button
                type="button"
                className={styles["profile-hero__options-btn"]}
                onClick={() => setShowOptions(!showOptions)}
                aria-label="More options"
              >
                <MoreHorizIcon />
              </button>

              {showOptions && (
                <div className={styles["profile-hero__dropdown"]}>
                  <button
                    type="button"
                    className={styles["profile-hero__btn--delete"]}
                    onClick={() => {
                      setShowOptions(false);
                      onOpenDelete();
                    }}
                  >
                    <DeleteOutlineIcon style={{ fontSize: 16 }} />
                    <span>Delete Account</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant={isFollowing ? "outline" : "primary"}
              disabled={pending}
              onClick={onFollowToggle}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>

      <div className={styles["profile-hero__stats"]}>
        <div className={styles["profile-hero__stat"]}>
          <span className={styles["profile-hero__stat-count"]}>
            {postsCount}
          </span>
          <span className={styles["profile-hero__stat-label"]}>Posts</span>
        </div>
        <div className={styles["profile-hero__stat-divider"]} />
        <button
          type="button"
          className={`${styles["profile-hero__stat"]} ${styles["profile-hero__stat--clickable"]}`}
          aria-label={`${followingCount} Following`}
          onClick={() => onOpenFollowList && onOpenFollowList("Following")}
        >
          <span className={styles["profile-hero__stat-count"]}>
            {followingCount}
          </span>
          <span className={styles["profile-hero__stat-label"]}>Following</span>
        </button>
        <div className={styles["profile-hero__stat-divider"]} />
        <button
          type="button"
          className={`${styles["profile-hero__stat"]} ${styles["profile-hero__stat--clickable"]}`}
          aria-label={`${followersCount} Followers`}
          onClick={() => onOpenFollowList && onOpenFollowList("Followers")}
        >
          <span className={styles["profile-hero__stat-count"]}>
            {followersCount}
          </span>
          <span className={styles["profile-hero__stat-label"]}>Followers</span>
        </button>
      </div>
    </Card>
  );
}

ProfileHero.propTypes = {
  user: PropTypes.object.isRequired,
  postsCount: PropTypes.number.isRequired,
  isOwner: PropTypes.bool.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  onFollowToggle: PropTypes.func.isRequired,
  onOpenDelete: PropTypes.func.isRequired,
  onOpenFollowList: PropTypes.func,
};
