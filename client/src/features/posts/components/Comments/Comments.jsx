import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../../../../shared/ui";
import styles from "./Comments.module.css";
export default function Comments({ comments }) {
  return (
    <div className={styles.list}>
      {comments.map((comment) => (
        <div key={comment._id} className={styles.item}>
          <Avatar user={comment.postedBy} size="sm" />
          <div className={styles.content}>
            <Link
              to={`/user/${comment.postedBy?._id}`}
              className={styles.authorName}
            >
              {comment.postedBy?.name || "Unknown"}
            </Link>
            <p className={styles.text}>{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
