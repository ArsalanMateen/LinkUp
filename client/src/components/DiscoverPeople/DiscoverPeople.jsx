import React, { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import useResource from "../../hooks/useResource";
import useAction from "../../hooks/useAction";
import RequestState from "../RequestState";
import { findPeople, follow, list } from "../../user/api";
import { Avatar, Button, Card } from "../common";
import styles from "./DiscoverPeople.module.css";

export default function DiscoverPeople({ onAuthRequired }) {
  const { session: authSession } = useAuth();
  const [toastMessage, setToastMessage] = useState("");
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const userId = authSession?.user._id;
  const token = authSession?.token;
  const load = useCallback(
    (signal) =>
      userId ? findPeople({ userId }, { t: token }, signal) : list(signal),
    [userId, token],
  );
  const resource = useResource(load);
  const action = useAction();
  const users = resource.data || [];
  const handleFollow = (user) => {
    if (!authSession) return onAuthRequired?.("follow members");
    action.run(async () => {
      await follow({ userId }, { t: token }, user._id);
      resource.setData((previous) =>
        previous.filter((person) => person._id !== user._id),
      );
      setToastMessage("Following " + user.name + "!");
      window.dispatchEvent(new Event("feed-refresh-requested"));
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setToastMessage(""), 3500);
    });
  };

  return (
    <Card as="aside" padding="md" className={styles["discover-people"]}>
      <div className={styles["discover-people__header"]}>
        <h2 className={styles["discover-people__title"]}>Discover People</h2>
        <Link to="/users" className={styles["discover-people__see-all"]}>
          See all
        </Link>
      </div>

      <RequestState
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.retry}
        inline
      />
      {action.error && <p role="alert">{action.error}</p>}
      <div className={styles["discover-people__list"]}>
        {users && users.length > 0
          ? users.slice(0, 5).map((user, index) => {
              const bioText = user.about || "Member of LinkUp community";

              return (
                <div
                  key={user._id || index}
                  className={styles["discover-people__item"]}
                >
                  <div className={styles["discover-people__left"]}>
                    <Avatar user={user} size="md" />
                    <div className={styles["discover-people__info"]}>
                      <Link
                        to={`/user/${user._id}`}
                        className={styles["discover-people__name"]}
                      >
                        {user.name}
                      </Link>
                      <span className={styles["discover-people__bio"]}>
                        {bioText}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={action.pending}
                    onClick={() => handleFollow(user)}
                  >
                    Follow
                  </Button>
                </div>
              );
            })
          : !resource.loading &&
            !resource.error && (
              <div className={styles["discover-people__empty"]}>
                No more users to suggest right now
              </div>
            )}
      </div>

      {toastMessage && (
        <div role="status" className={styles["discover-people__toast"]}>
          {toastMessage}
        </div>
      )}
    </Card>
  );
}

DiscoverPeople.propTypes = {
  onAuthRequired: PropTypes.func,
};
