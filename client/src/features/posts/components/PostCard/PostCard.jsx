import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Card } from "../../../../shared/ui";
import { getHandle, getTimeAgo } from "../../../../shared/utils/format";
import styles from "./PostCard.module.css";
import { useState } from "react";
import usePostComments from "../../hooks/usePostComments";
import Comments from "../Comments/Comments";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
export default function PostCard({ post, onRemove }) {
  const comments = usePostComments(post._id, post.commentCount || 0);
  const [open, setOpen] = useState(false);
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
      <button
        onClick={() => {
          comments.open();
          setOpen(!open);
        }}
        className={styles.actionButton}
      >
        Comment ({comments.count})
      </button>
      {open && (
        <>
          <RequestState
            loading={comments.loading}
            error={comments.error}
            onRetry={comments.retry}
          />
          {comments.loaded && (
            <Comments
              postId={post._id}
              comments={comments.comments}
              updateComments={comments.updateComments}
            />
          )}
        </>
      )}
    </Card>
  );
}
