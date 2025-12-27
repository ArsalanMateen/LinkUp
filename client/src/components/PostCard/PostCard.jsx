import { apiUrl } from "../../api/client";
import React, { useState, useRef, useEffect } from "react";
import useAction from "../../hooks/useAction";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { remove, like, unlike } from "../../post/api";
import { getHandle, getTimeAgo } from "../../utils/format";
import Comments from "../Comments/Comments";
import { Avatar, Card } from "../common";
import styles from "./PostCard.module.css";
import { Favorite as FavoriteIcon } from "../Icons";
import { ChatBubbleOutline as ChatBubbleOutlineIcon } from "../Icons";
import { MoreHoriz as MoreHorizIcon } from "../Icons";
import { DeleteOutline as DeleteOutlineIcon } from "../Icons";
import { ThumbUpAltOutlined as ThumbUpAltOutlinedIcon } from "../Icons";

export default function PostCard({ post, onRemove, onAuthRequired }) {
  const auth = useAuth();
  const action = useAction();
  const authSession = auth.session;
  const currentUserId =
    authSession && authSession.user ? authSession.user._id : null;
  const isAuthor =
    currentUserId && post.postedBy && currentUserId === post.postedBy._id;

  const checkLiked = (likes) => {
    return likes && currentUserId ? likes.indexOf(currentUserId) !== -1 : false;
  };

  const [isLiked, setIsLiked] = useState(checkLiked(post.likes));
  const [likesCount, setLikesCount] = useState(
    post.likes ? post.likes.length : 0,
  );
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, []);

  useEffect(() => {
    setIsLiked(Boolean(currentUserId && post.likes?.includes(currentUserId)));
    setLikesCount(post.likes?.length || 0);
    setComments(post.comments || []);
  }, [post.likes, post.comments, currentUserId]);
  const handleLikeToggle = () => {
    if (!authSession) return onAuthRequired?.("like posts");
    action.run(async () => {
      const result = await (isLiked ? unlike : like)(
        { userId: currentUserId },
        { t: authSession.token },
        post._id,
      );
      setIsLiked(result.likes.includes(currentUserId));
      setLikesCount(result.likes.length);
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
    <Card as="article" padding="md" className={styles["post-card"]}>
      <header className={styles["post-card__header"]}>
        <div className={styles["post-card__author"]}>
          <Avatar user={post.postedBy} size="md" />
          <div className={styles["post-card__meta"]}>
            <div className={styles["post-card__author-row"]}>
              <Link
                to={`/user/${post.postedBy ? post.postedBy._id : ""}`}
                className={styles["post-card__author-name"]}
              >
                {post.postedBy ? post.postedBy.name : "Unknown User"}
              </Link>
              <span className={styles["post-card__bullet"]}>•</span>
              <span className={styles["post-card__time"]}>
                {getTimeAgo(post.created)}
              </span>
            </div>
            <span className={styles["post-card__author-handle"]}>
              {getHandle(post.postedBy)}
            </span>
          </div>
        </div>

        {isAuthor && (
          <div className={styles["post-card__options"]} ref={optionsRef}>
            <button
              type="button"
              className={styles["post-card__options-btn"]}
              onClick={() => setShowOptions(!showOptions)}
              aria-label="More options"
            >
              <MoreHorizIcon />
            </button>

            {showOptions && (
              <div className={styles["post-card__dropdown"]}>
                <button
                  type="button"
                  className={styles["post-card__delete-btn"]}
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
      <p className={styles["post-card__text"]}>{post.text}</p>

      {post.photo && (
        <div className={styles["post-card__image-wrap"]}>
          <img
            src={post.photo?.url || apiUrl(`/api/posts/photo/${post._id}`)}
            alt="Post attachment"
            className={styles["post-card__image"]}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className={styles["post-card__engagement-bar"]}>
        <div className={styles["post-card__stats"]}>
          <div className={styles["post-card__stat-item"]}>
            <FavoriteIcon className={styles["post-card__heart-icon"]} />
            <span>{likesCount}</span>
          </div>
          <div className={styles["post-card__stat-item"]}>
            <ChatBubbleOutlineIcon
              className={styles["post-card__comment-icon"]}
            />
            <span>{comments.length}</span>
          </div>
        </div>

        <div className={styles["post-card__actions"]}>
          <button
            type="button"
            className={`${styles["post-card__action-btn"]} ${isLiked ? styles["post-card__action-btn--active"] : ""}`}
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
            className={styles["post-card__action-btn"]}
            onClick={() => setShowComments(!showComments)}
          >
            <ChatBubbleOutlineIcon style={{ fontSize: 17 }} />
            <span>Comment</span>
          </button>
        </div>
      </div>

      {showComments && (
        <Comments
          postId={post._id}
          comments={comments}
          updateComments={setComments}
          onAuthRequired={onAuthRequired}
        />
      )}
    </Card>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  onAuthRequired: PropTypes.func,
};
