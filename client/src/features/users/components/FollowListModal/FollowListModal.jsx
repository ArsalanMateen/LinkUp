import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getHandle } from "../../../../shared/utils/format";
import { Avatar, Modal } from "../../../../shared/ui";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import styles from "./FollowListModal.module.css";

export default function FollowListModal({
  isOpen,
  onClose,
  title,
  people,
  count = 0,
  connections,
}) {
  const scrollRoot = useRef(null);

  if (!isOpen) return null;

  const list = (people || []).filter(
    (p) => p && (p._id || typeof p === "string"),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${title} (${count})`}
      maxWidth="sm"
      bodyClassName={styles.body}
      bodyRef={scrollRoot}
    >
      <RequestState
        loading={connections.loading}
        error={connections.error}
        onRetry={connections.refresh}
        inline
      />
      {list.length > 0 ? (
        list.map((user, i) => {
          return (
            <Link
              to={`/user/${user._id}`}
              onClick={onClose}
              key={user._id || i}
              className={styles.item}
            >
              <div className={styles.left}>
                <Avatar user={user} size="sm" />
                <div className={styles.info}>
                  <span className={styles.name}>{user.name}</span>
                  <span className={styles.handle}>{getHandle(user)}</span>
                </div>
              </div>
            </Link>
          );
        })
      ) : !connections.loading && !connections.error ? (
        <div className={styles.empty}>No {title.toLowerCase()} to display</div>
      ) : null}
      <RequestState
        error={connections.loadMoreError}
        onRetry={connections.loadMore}
        inline
      />
      <RequestState loading={connections.loadingMore} inline />
      <button
        type="button"
        onClick={connections.loadMore}
        disabled={
          !(
            connections.hasMore &&
            !connections.loading &&
            !connections.loadingMore &&
            !connections.error &&
            !connections.loadMoreError
          )
        }
      >
        Load more
      </button>
    </Modal>
  );
}

FollowListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  people: PropTypes.array.isRequired,
  count: PropTypes.number,
  connections: PropTypes.object.isRequired,
};
