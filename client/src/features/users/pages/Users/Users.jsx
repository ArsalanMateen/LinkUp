import React from "react";
import { Link } from "react-router-dom";
import useUsers from "../../hooks/useUsers";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import { Avatar, Card } from "../../../../shared/ui";
import { getHandle } from "../../../../shared/utils/format";
import styles from "./Users.module.css";

export default function Users() {
  const resource = useUsers();

  const { users } = resource;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Community Members</h1>
        <p className={styles.subtitle}>
          Discover and connect with thinkers, creators, and builders on LinkUp.
        </p>
      </header>

      <Card padding="none" className={styles.card}>
        <div className={styles.list}>
          <RequestState
            loading={resource.loading}
            error={resource.error}
            onRetry={resource.refresh}
            inline
          />
          {!resource.loading && !resource.error && !users.length && (
            <p>No members yet.</p>
          )}
          {users.map((user) => {
            return (
              <Link
                to={`/user/${user._id}`}
                key={user._id}
                className={styles.item}
              >
                <div className={styles.left}>
                  <Avatar user={user} size="md" />
                  <div className={styles.info}>
                    <span className={styles.name}>{user.name}</span>
                    <span className={styles.handle}>{getHandle(user)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
      <div className="text-center mt-3">
        <RequestState
          error={resource.loadMoreError}
          onRetry={resource.loadMore}
          inline
        />
        <RequestState loading={resource.loadingMore} inline />
        <button
          type="button"
          onClick={resource.loadMore}
          disabled={
            !(
              resource.hasMore &&
              !resource.loading &&
              !resource.loadingMore &&
              !resource.error &&
              !resource.loadMoreError
            )
          }
        >
          Load more
        </button>
      </div>
    </div>
  );
}
