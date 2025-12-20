import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getHandle } from "../../utils/format";
import { Avatar, Button, Modal } from "../common";
import styles from "./FollowListModal.module.css";

export default function FollowListModal({
  isOpen,
  onClose,
  title,
  people,
  currentUserId,
  currentUserFollowing,
  onToggleFollow,
  pending,
  error,
}) {
  if (!isOpen) return null;

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

  const list = (people || []).filter(
    (p) => p && (p._id || typeof p === "string"),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${title} (${list.length})`}
      maxWidth="sm"
      bodyClassName={styles["follow-list-modal__body"]}
    >
      {error && <p role="alert">{error}</p>}
      {list.length > 0 ? (
        list.map((user, i) => {
          const isSelf = currentUserId && user._id === currentUserId;
          const following = isUserFollowed(user._id);

          return (
            <div
              key={user._id || i}
              className={styles["follow-list-modal__item"]}
            >
              <Link
                to={`/user/${user._id}`}
                className={styles["follow-list-modal__left"]}
                onClick={onClose}
              >
                <Avatar user={user} size="sm" />
                <div className={styles["follow-list-modal__info"]}>
                  <span className={styles["follow-list-modal__name"]}>
                    {user.name}
                  </span>
                  <span className={styles["follow-list-modal__handle"]}>
                    {getHandle(user)}
                  </span>
                </div>
              </Link>

              {!isSelf && onToggleFollow && (
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
        <div className={styles["follow-list-modal__empty"]}>
          No {title.toLowerCase()} to display
        </div>
      )}
    </Modal>
  );
}

FollowListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  people: PropTypes.array.isRequired,
  currentUserId: PropTypes.string,
  currentUserFollowing: PropTypes.array,
  onToggleFollow: PropTypes.func.isRequired,
  pending: PropTypes.bool,
  error: PropTypes.string,
};
