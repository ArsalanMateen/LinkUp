import React, { useState } from "react";
import useAction from "../../../../shared/hooks/useAction";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/context/AuthProvider";
import { comment, uncomment } from "../../api/postsApi";
import { getHandle, getTimeAgo } from "../../../../shared/utils/format";
import { Avatar, Button } from "../../../../shared/ui";
import styles from "./Comments.module.css";
import { DeleteOutline as DeleteOutlineIcon } from "../../../../shared/ui/Icons/Icons";

export default function Comments({
  postId,
  comments,
  updateComments,
  onAuthRequired,
}) {
  const auth = useAuth();
  const [text, setText] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const postAction = useAction();
  const deleteAction = useAction();

  const isPosting = postAction.pending;
  const authSession = auth.session;
  const currentUser = authSession ? authSession.user : {};

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!authSession) return onAuthRequired?.("post comments");
    if (!text.trim()) return;

    postAction.run(async () => {
      const result = await comment(
        { userId: currentUser._id },
        { t: authSession.token },
        postId,
        { text: text.trim() },
      );
      updateComments(result.comments);
      setText("");
    });
  };

  const handleDelete = (selected) => () => {
    if (!authSession) return onAuthRequired?.("delete comments");

    setDeletingId(selected._id);
    deleteAction.run(async () => {
      try {
        const result = await uncomment(
          { userId: currentUser._id },
          { t: authSession.token },
          postId,
          selected,
        );
        updateComments(result.comments);
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className={styles.root}>
      {(postAction.error || deleteAction.error) && (
        <p role="alert">{postAction.error || deleteAction.error}</p>
      )}
      <div className={styles.inputRow}>
        <Avatar user={currentUser} size="sm" />
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            aria-label="Comment"
            type="text"
            className={styles.input}
            placeholder={
              authSession
                ? "Write a comment..."
                : "Sign in to write a comment..."
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={(e) => {
              if (!authSession && onAuthRequired) {
                e.target.blur();
                onAuthRequired("post comments");
              }
            }}
          />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            disabled={!text.trim() || isPosting}
            loading={isPosting}
            loadingText="Posting..."
          >
            Post
          </Button>
        </form>
      </div>

      <div className={styles.list}>
        {comments &&
          comments.map((comment, index) => {
            const isAuthor =
              currentUser &&
              comment.postedBy &&
              currentUser._id === comment.postedBy._id;
            const commentAuthor = isAuthor
              ? {
                  ...comment.postedBy,
                  photo: currentUser.photo ?? comment.postedBy?.photo
                }
              : comment.postedBy;

            return (
              <div
                key={comment._id || index}
                className={styles.item}
              >
                <Avatar user={commentAuthor} size="sm" />
                <div className={styles.content}>
                  <div className={styles.header}>
                    <div className={styles.headerLeft}>
                      <div className={styles.topRow}>
                        <Link
                          to={`/user/${comment.postedBy ? comment.postedBy._id : ""}`}
                          className={styles.authorName}
                        >
                          {comment.postedBy ? comment.postedBy.name : "Unknown"}
                        </Link>
                        <span className={styles.bullet}>•</span>
                        <span className={styles.time}>
                          {getTimeAgo(comment.created)}
                        </span>
                        {isAuthor && (
                          <span className={styles.badge}>(You)</span>
                        )}
                      </div>
                      <span className={styles.authorHandle}>
                        {getHandle(comment.postedBy)}
                      </span>
                    </div>

                    {isAuthor && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === comment._id}
                        onClick={handleDelete(comment)}
                        title="Delete comment"
                        aria-label="Delete comment"
                      >
                        <DeleteOutlineIcon style={{ fontSize: 16 }} />
                      </Button>
                    )}
                  </div>

                  <p className={styles.text}>{comment.text}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired,
  onAuthRequired: PropTypes.func,
};
