import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { apiUrl, avatarUrl } from "../../api/client";
import { getHandle, getTimeAgo } from "../../utils/format";
import { Card, Avatar } from "../common";
import styles from "./PostCard.module.css";

export default function PostCard({ post }) {
  const authorPhoto = post.postedBy?._id
    ? avatarUrl(post.postedBy)
    : apiUrl("/api/users/defaultphoto");

  return (
    <Card as="article" className={styles["post-card"]}>
      <header className={styles["post-card__header"]}>
        <Avatar
          src={authorPhoto}
          alt={post.postedBy?.name || "User"}
          size="md"
        />
        <div className={styles["post-card__meta"]}>
          <Link
            to={`/user/${post.postedBy?._id || ""}`}
            className={styles["post-card__author-name"]}
          >
            {post.postedBy?.name || "Unknown User"}
          </Link>
          <span className={styles["post-card__author-handle"]}>
            {getHandle(post.postedBy)}
          </span>
          <span className={styles["post-card__time"]}>
            {getTimeAgo(post.created)}
          </span>
        </div>
      </header>
      <p className={styles["post-card__text"]}>{post.text}</p>
      {post.photo && (
        <img
          src={apiUrl(`/api/posts/photo/${post._id}`)}
          alt="Post attachment"
          className={styles["post-card__image"]}
        />
      )}
    </Card>
  );
}

PostCard.propTypes = { post: PropTypes.object.isRequired };
