import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { list } from "./api";
import useResource from "../hooks/useResource";
import RequestState from "../components/RequestState";
import { Avatar, Card } from "../components/common";
import { getHandle } from "../utils/format";
import styles from "./Users.module.css";

export default function Users() {
  const load = useCallback((signal) => list(signal), []);
  const resource = useResource(load);
  const users = resource.data || [];
  return (
    <div className={styles["users-page"]}>
      <header className={styles["users-page__header"]}>
        <h1 className={styles["users-page__title"]}>Community Members</h1>
        <p className={styles["users-page__subtitle"]}>
          Discover and connect with thinkers, creators, and builders on LinkUp.
        </p>
      </header>

      <Card padding="none" className={styles["users-page__card"]}>
        <div className={styles["users-page__list"]}>
          <RequestState
            loading={resource.loading}
            error={resource.error}
            onRetry={resource.retry}
            inline
          />
          {!resource.loading && !resource.error && !users.length && (
            <p>No members yet.</p>
          )}
          {users.map((user, i) => {
            return (
              <Link
                to={`/user/${user._id}`}
                key={user._id || i}
                className={styles["users-page__item"]}
              >
                <div className={styles["users-page__left"]}>
                  <Avatar user={user} size="md" />
                  <div className={styles["users-page__info"]}>
                    <span className={styles["users-page__name"]}>
                      {user.name}
                    </span>
                    <span className={styles["users-page__handle"]}>
                      {getHandle(user)}
                    </span>
                  </div>
                </div>

                <span className={styles["users-page__view-btn"]}>
                  View Profile
                </span>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
