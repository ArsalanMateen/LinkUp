import React from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../../auth/context/AuthProvider";
import { getHandle } from "../../../../shared/utils/format";
import { Avatar, Button, Card } from "../../../../shared/ui";
import styles from "./ProfileHero.module.css";
import { CalendarTodayOutlined as CalendarTodayOutlinedIcon } from "../../../../shared/ui/Icons/Icons";

export default function ProfileHero({
  user,
  postsCount,
  postsCountHasMore = false,
  isOwner,
  isFollowing,
  pending,
  onFollowToggle,
  onOpenFollowList,
}) {
  const auth = useAuth();

  const authSession = auth.session;
  const currentUserId =
    authSession && authSession.user ? String(authSession.user._id) : null;
  const targetUserId = user && user._id ? String(user._id) : null;
  const isActualOwner = Boolean(
    isOwner ||
    (currentUserId && targetUserId && currentUserId === targetUserId),
  );

  const formattedJoinedDate = user.created
    ? `Joined ${new Date(user.created).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
    : "Joined 2024";

  const followingCount = user.followingCount || 0;
  const followersCount = user.followersCount || 0;

  return (
    <Card padding="lg" className={styles.root}>
      <div className={styles.top}>
        <div className={styles.left}>
          <Avatar user={user} size="xl" />
          <div className={styles.meta}>
            <h1 className={styles.name}>{user.name}</h1>
            <span className={styles.handle}>
              {getHandle(user)}
            </span>
            <div className={styles.joined}>
              <CalendarTodayOutlinedIcon
                className={styles.calendarIcon}
              />
              <span>{formattedJoinedDate}</span>
            </div>
          </div>
        </div>

        {!isActualOwner && (
          <div className={styles.actions}>
            <Button
              variant={isFollowing ? "outline" : "primary"}
              disabled={pending}
              onClick={onFollowToggle}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statCount}>
            {postsCount == null ? "—" : `${postsCount}${postsCountHasMore ? "+" : ""}`}
          </span>
          <span className={styles.statLabel}>Posts</span>
        </div>
        <div className={styles.statDivider} />
        <button
          type="button"
          className={`${styles.stat} ${styles.statClickable}`}
          aria-label={`${followingCount} Following`}
          onClick={() => onOpenFollowList && onOpenFollowList("Following")}
        >
          <span className={styles.statCount}>
            {followingCount}
          </span>
          <span className={styles.statLabel}>Following</span>
        </button>
        <div className={styles.statDivider} />
        <button
          type="button"
          className={`${styles.stat} ${styles.statClickable}`}
          aria-label={`${followersCount} Followers`}
          onClick={() => onOpenFollowList && onOpenFollowList("Followers")}
        >
          <span className={styles.statCount}>
            {followersCount}
          </span>
          <span className={styles.statLabel}>Followers</span>
        </button>
      </div>
    </Card>
  );
}

ProfileHero.propTypes = {
  user: PropTypes.object.isRequired,
  postsCount: PropTypes.number,
  postsCountHasMore: PropTypes.bool,
  isOwner: PropTypes.bool.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  onFollowToggle: PropTypes.func.isRequired,
  onOpenFollowList: PropTypes.func,
};
