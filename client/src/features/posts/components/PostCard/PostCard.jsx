import React, { useState, useEffect } from "react";
import useAction from "../../../../shared/hooks/useAction";
import usePostComments from "../../hooks/usePostComments";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/context/AuthProvider";
import { remove, like, unlike } from "../../api/postsApi";
import { getHandle, getTimeAgo } from "../../../../shared/utils/format";
import Comments from "../Comments/Comments";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import { Avatar, Card } from "../../../../shared/ui";
import styles from "./PostCard.module.css";
import { Favorite as FavoriteIcon } from "../../../../shared/ui/Icons/Icons";
import { ChatBubbleOutline as ChatBubbleOutlineIcon } from "../../../../shared/ui/Icons/Icons";
import { MoreHoriz as MoreHorizIcon } from "../../../../shared/ui/Icons/Icons";
import { DeleteOutline as DeleteOutlineIcon } from "../../../../shared/ui/Icons/Icons";
import { ThumbUpAltOutlined as ThumbUpAltOutlinedIcon } from "../../../../shared/ui/Icons/Icons";

function PostCard({
  post,
  onRemove,
  onAuthRequired,
  menuOpen = false,
  onToggleMenu,
  menuRef
}) {
  const auth = useAuth();
  const action = useAction();

  const authSession = auth.session;
  const currentUserId =
    authSession && authSession.user ? authSession.user._id : null;
  const isAuthor =
    currentUserId && post.postedBy && currentUserId === post.postedBy._id;
  const authorUser = isAuthor
    ? {
        ...post.postedBy,
        photo: authSession?.user?.photo ?? post.postedBy?.photo
      }
    : post.postedBy;

  const [isLiked, setIsLiked] = useState(Boolean(currentUserId && post.likedByMe));
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const comments = usePostComments(post._id, post.commentCount || 0);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setIsLiked(Boolean(currentUserId && post.likedByMe));
    setLikesCount(post.likesCount || 0);
  }, [post, currentUserId]);

  const handleLikeToggle = () => {
    if (!authSession) return onAuthRequired?.("like posts");

    action.run(async () => {
      const result = await (isLiked ? unlike : like)(
        { userId: currentUserId },
        { t: authSession.token },
        post._id,
      );
      setIsLiked(result.likedByMe);
      setLikesCount(result.likesCount);
    });
  };

  const handleDeletePost = () => {
    if (!authSession) return onAuthRequired?.("delete posts");

    action.run(async () => {
      await remove({ postId: post._id }, { t: authSession.token });
      onRemove(post);
    });
  };

  return (
    <Card as="article" padding="md" className={styles.root}>
      <header className={styles.header}>
        <div className={styles.author}>
          <Avatar user={authorUser} size="md" />
          <div className={styles.meta}>
            <div className={styles.authorRow}>
              <Link
                to={`/user/${post.postedBy ? post.postedBy._id : ""}`}
                className={styles.authorName}
              >
                {post.postedBy ? post.postedBy.name : "Unknown User"}
              </Link>
              <span className={styles.bullet}>•</span>
              <span className={styles.time}>
                {getTimeAgo(post.created)}
              </span>
            </div>
            <span className={styles.authorHandle}>
              {getHandle(post.postedBy)}
            </span>
          </div>
        </div>

        {isAuthor && (
          <div className={styles.options} ref={menuOpen ? menuRef : null}>
            <button
              type="button"
              className={styles.optionsButton}
              onClick={() => onToggleMenu?.(post._id)}
              aria-label="More options"
              aria-expanded={menuOpen}
            >
              <MoreHorizIcon />
            </button>

            {menuOpen && (
              <div className={styles.dropdown}>
                <button
                  type="button"
                  className={styles.deleteButton}
                  disabled={action.pending}
                  onClick={handleDeletePost}
                >
                  <DeleteOutlineIcon style={{ fontSize: 16 }} />
                  <span>Delete Post</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {action.error && <p role="alert">{action.error}</p>}
      <p className={styles.text}>{post.text}</p>

      {post.photo && (
        <div className={styles.imageWrap}>
          <img
            src={post.photo?.url || post.photo}
            alt="Post attachment"
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className={styles.engagementBar}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <FavoriteIcon className={styles.heartIcon} />
            <span aria-label="Like count">{likesCount}</span>
          </div>
          <div className={styles.statItem}>
            <ChatBubbleOutlineIcon
              className={styles.commentIcon}
            />
            <span aria-label="Comment count">{comments.count}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.actionButton} ${isLiked ? styles.actionButtonActive : ""}`}
            disabled={action.pending}
            aria-pressed={Boolean(isLiked)}
            onClick={handleLikeToggle}
          >
            {isLiked ? (
              <FavoriteIcon style={{ fontSize: 17, color: "#ef4444" }} />
            ) : (
              <ThumbUpAltOutlinedIcon style={{ fontSize: 17 }} />
            )}
            <span>Like</span>
          </button>

          <button
            type="button"
            className={styles.actionButton}
            aria-expanded={showComments}
            onClick={() => {
              comments.open();
              setShowComments((previous) => !previous);
            }}
          >
            <ChatBubbleOutlineIcon style={{ fontSize: 17 }} />
            <span>Comment</span>
          </button>
        </div>
      </div>

      {showComments && (
        <>
          <RequestState
            loading={comments.loading}
            error={comments.error}
            onRetry={comments.retry}
            inline
          />
          {comments.loaded && !comments.loading && !comments.error && (
            <Comments
              postId={post._id}
              comments={comments.comments}
              updateComments={comments.updateComments}
              onAuthRequired={onAuthRequired}
            />
          )}
        </>
      )}
    </Card>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  onAuthRequired: PropTypes.func,
  menuOpen: PropTypes.bool,
  onToggleMenu: PropTypes.func,
  menuRef: PropTypes.shape({ current: PropTypes.any }),
};

export default React.memo(PostCard);
