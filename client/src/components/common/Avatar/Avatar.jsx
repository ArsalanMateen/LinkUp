import React from "react";
import PropTypes from "prop-types";
import { avatarUrl, apiUrl } from "../../../api/client";
import { fallbackAvatar } from "../../../utils/image";
import styles from "./Avatar.module.css";

export default function Avatar({
  user,
  src,
  alt,
  size = "md",
  className = "",
  loading = "lazy",
  onClick,
}) {
  const resolvedSrc = src || (user ? avatarUrl(user) : apiUrl("/api/users/defaultphoto"));
  const resolvedAlt = alt || (user && user.name ? user.name : "User");

  const sizeClass = styles[`avatar--${size}`] || styles["avatar--md"];

  return (
    <img
      src={resolvedSrc}
      alt={resolvedAlt}
      className={`${styles.avatar} ${sizeClass} ${className}`.trim()}
      onError={fallbackAvatar}
      loading={loading}
      onClick={onClick}
    />
  );
}

Avatar.propTypes = {
  user: PropTypes.object,
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  loading: PropTypes.oneOf(["lazy", "eager"]),
  onClick: PropTypes.func,
};
