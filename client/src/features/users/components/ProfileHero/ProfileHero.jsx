import React from "react";
import { Avatar, Card } from "../../../../shared/ui";
import { getHandle } from "../../../../shared/utils/format";
import styles from "./ProfileHero.module.css";
export default function ProfileHero({
  user,
  postsCount,
  isOwner,
  isFollowing,
  pending,
  onFollowToggle,
}) {
  return (
    <Card padding="lg" className={styles.root}>
      <div className={styles.top}>
        <div className={styles.left}>
          <Avatar user={user} size="xl" />
          <div className={styles.meta}>
            <h1 className={styles.name}>{user.name}</h1>
            <span className={styles.handle}>{getHandle(user)}</span>
            <p className={styles.joined}>
              Joined{" "}
              {new Date(user.created).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
