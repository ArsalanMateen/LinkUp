import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getHandle } from "../../utils/format";
import { Avatar, Button, Card } from "../common";
import styles from "./FollowListWidget.module.css";

export default function FollowListWidget({
  title,
  people,
  currentUserId,
  currentUserFollowing,
  onToggleFollow,
  onSeeAll,
  pending,
}) {
  const isUserFollowed = (targetId) => {
    if (!currentUserFollowing || !targetId) return false;
    return currentUserFollowing.some((followingEntry) => {
      if (!followingEntry) return false;
      const followingUserId =
        typeof followingEntry === "object"
          ? followingEntry._id
          : followingEntry;
      return String(followingUserId) === String(targetId);
    });
  };

  const validPeople = (people || []).filter(
    (p) => p && (p._id || typeof p === "string"),
  );
  const count = validPeople.length;

  return (
    <Card padding="md" className={styles["follow-list-widget"]}>
      <div className={styles["follow-list-widget__header"]}>
        <h2 className={styles["follow-list-widget__title"]}>
          {title} ({count})
        </h2>
        <button
          type="button"
          className={styles["follow-list-widget__see-all"]}
          onClick={() => onSeeAll && onSeeAll(title)}
        >
          See all
        </button>
      </div>

      <div className={styles["follow-list-widget__list"]}>
        {validPeople.length > 0 ? (
          validPeople.slice(0, 5).map((user, i) => {
            const isSelf = currentUserId && user._id === currentUserId;
            const following = isUserFollowed(user._id);

            return (
              <div
                key={user._id || i}
                className={styles["follow-list-widget__item"]}
              >
                <div className={styles["follow-list-widget__left"]}>
                  <Avatar user={user} size="sm" />
                  <div className={styles["follow-list-widget__info"]}>
                    <Link
                      to={`/user/${user._id}`}
                      className={styles["follow-list-widget__name"]}
                    >
                      {user.name}
                    </Link>
                    <span className={styles["follow-list-widget__handle"]}>
                      {getHandle(user)}
                    </span>
                  </div>
                </div>

                {!isSelf && (
                  <Button
                    variant={following ? "outline" : "primary"}
                    size="sm"
                    disabled={pending}
                    onClick={() => onToggleFollow(user, following)}
                  >
                    {following ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <div className={styles["follow-list-widget__empty"]}>
            No {title.toLowerCase()} yet
          </div>
        )}
      </div>
    </Card>
  );
}

FollowListWidget.propTypes = {
  title: PropTypes.string.isRequired,
  people: PropTypes.array.isRequired,
  currentUserId: PropTypes.string,
  currentUserFollowing: PropTypes.array,
  onToggleFollow: PropTypes.func.isRequired,
  onSeeAll: PropTypes.func,
};
