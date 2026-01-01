import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getHandle } from "../../../../shared/utils/format";
import { Avatar, Card } from "../../../../shared/ui";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import styles from "./FollowListWidget.module.css";

export default function FollowListWidget({
  title,
  count,
  people,
  connections,
  onSeeAll
}) {
  return (
    <Card padding="md" className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title} ({count})</h2>
        <button
          type="button"
          className={styles.seeAll}
          onClick={() => onSeeAll?.(title)}
          aria-label={`View ${title.toLowerCase()}`}
        >
          See all
        </button>
      </div>
      <RequestState
        loading={connections.loading}
        error={connections.error}
        onRetry={connections.refresh}
        inline
      />
      <div className={styles.list}>
        {people.slice(0, 5).map((person) => (
          <Link to={`/user/${person._id}`} key={person._id} className={styles.item}>
            <div className={styles.left}>
              <Avatar user={person} size="sm" />
              <div className={styles.info}>
                <span className={styles.name}>
                  {person.name}
                </span>
                <span className={styles.handle}>{getHandle(person)}</span>
              </div>
            </div>
          </Link>
        ))}
        {!people.length && !connections.loading && !connections.error && (
          <div className={styles.empty}>No {title.toLowerCase()} yet</div>
        )}
      </div>
    </Card>
  );
}

FollowListWidget.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  people: PropTypes.array.isRequired,
  connections: PropTypes.object.isRequired,
  onSeeAll: PropTypes.func,
};
