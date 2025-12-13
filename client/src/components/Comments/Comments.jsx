import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { apiUrl, avatarUrl } from "../../api/client";
import { getTimeAgo } from "../../utils/format";
import { Avatar } from "../common";
import styles from "./Comments.module.css";

export default function Comments({ comments }) {
  return (
    <div className={styles["comments"]}>
      <div className={styles["comments__list"]}>
        {comments.map((commentItem, index) => (
          <div
            key={commentItem._id || index}
            className={styles["comments__item"]}
          >
            <Avatar
              src={
                commentItem.postedBy?._id
                  ? avatarUrl(commentItem.postedBy)
                  : apiUrl("/api/users/defaultphoto")
              }
              alt={commentItem.postedBy?.name || "User"}
              size="sm"
            />
            <div className={styles["comments__content"]}>
              <Link to={`/user/${commentItem.postedBy?._id || ""}`}>
                {commentItem.postedBy?.name || "Unknown"}
              </Link>
              <span>{getTimeAgo(commentItem.created)}</span>
              <p className={styles["comments__text"]}>{commentItem.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Comments.propTypes = { comments: PropTypes.array.isRequired };
