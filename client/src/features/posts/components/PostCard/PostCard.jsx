import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Card } from "../../../../shared/ui";
import { getHandle, getTimeAgo } from "../../../../shared/utils/format";
import styles from "./PostCard.module.css";
import { useState } from "react";
import usePostComments from "../../hooks/usePostComments";
import Comments from "../Comments/Comments";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import { useAuth } from "../../../auth/context/AuthProvider";
import useAction from "../../../../shared/hooks/useAction";
import { like, unlike } from "../../api/postsApi";
export default function PostCard({ post, onRemove }) {
  const comments = usePostComments(post._id, post.commentCount || 0);
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const action = useAction();
  const [likes, setLikes] = useState({
    likesCount: post.likesCount || 0,
    likedByMe: post.likedByMe || false,
  });
  const toggle = () => {
    if (!session) return;
    action.run(async () =>
      setLikes(
        await (likes.likedByMe ? unlike : like)(
          { userId: session.user._id },
          { t: session.token },
          post._id,
        ),
      ),
    );
  };
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
      <button
        onClick={toggle}
        disabled={action.pending}
        aria-pressed={likes.likedByMe}
        className={styles.actionButton}
      >
        Like ({likes.likesCount})
      </button>
      {action.error && <p role="alert">{action.error}</p>}
    </Card>
  );
}
