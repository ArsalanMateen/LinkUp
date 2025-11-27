import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/context/AuthProvider";
import useResource from "../../../../shared/hooks/useResource";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import { findPeople, list } from "../../api/usersApi";
import { Avatar, Card } from "../../../../shared/ui";
import styles from "./DiscoverPeople.module.css";

export default function DiscoverPeople() {
  const { session: authSession } = useAuth();

  const userId = authSession?.user._id;
  const token = authSession?.token;

  const load = useCallback(
    async (signal) =>
      userId
        ? findPeople({ userId }, { t: token }, signal)
        : (await list({ limit: 5 }, signal)).slice(0, 5),
    [userId, token],
  );

  const resource = useResource(load);

  const users = resource.data || [];

  return (
    <Card as="aside" padding="md" className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Discover People</h2>
        <Link to="/users" className={styles.seeAll}>
          See all
        </Link>
      </div>

      <RequestState
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.retry}
        inline
      />
      <div className={styles.list}>
        {users && users.length > 0
          ? users.map((user) => {
              const bioText = user.about || "Member of LinkUp community";

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
                      <span className={styles.bio}>{bioText}</span>
                    </div>
                  </div>
                </Link>
              );
            })
          : !resource.loading &&
            !resource.error && (
              <div className={styles.empty}>
                No more users to suggest right now
              </div>
            )}
      </div>
    </Card>
  );
}
