import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Card } from "../../../../shared/ui";
import { getHandle, getTimeAgo } from "../../../../shared/utils/format";
import styles from "./PostCard.module.css";
export default function PostCard({ post, onRemove }) {
  return (
    <Card as="article" className={styles.root}>
      <header className={styles.header}>
        <div className={styles.author}>
          <Avatar user={post.postedBy} />
          <div className={styles.meta}>
            <Link
              to={`/user/${post.postedBy?._id}`}
              className={styles.authorName}
            >
              {post.postedBy?.name || "Unknown User"}
            </Link>
            <span className={styles.time}>{getTimeAgo(post.created)}</span>
            <span className={styles.authorHandle}>
              {getHandle(post.postedBy)}
            </span>
          </div>
        </div>
      </header>
      <p className={styles.text}>{post.text}</p>
    </Card>
  );
}
