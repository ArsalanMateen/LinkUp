import React from "react";
import PropTypes from "prop-types";
import { avatarUrl } from "../../api/client";
import defaultAvatar from "../../assets/images/placeholder.png";
import { fallbackAvatar } from "../../utils/image";
import styles from "./Avatar.module.css";

const sizeClasses = new Map([
  ["xs", styles.sizeXs],
  ["sm", styles.sizeSm],
  ["md", styles.sizeMd],
  ["lg", styles.sizeLg],
  ["xl", styles.sizeXl],
]);

export default function Avatar({
  user,
  src,
  alt,
  size = "md",
  className = "",
  loading = "lazy",
  onClick,
}) {
  const resolvedSrc = src || (user ? avatarUrl(user) : defaultAvatar);
  const resolvedAlt = alt || (user && user.name ? user.name : "User");

  const sizeClass = sizeClasses.get(String(size)) || styles.sizeMd;

  return (
    <img
      src={resolvedSrc}
      alt={resolvedAlt}
      className={`${styles.root} ${sizeClass} ${className}`.trim()}
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
