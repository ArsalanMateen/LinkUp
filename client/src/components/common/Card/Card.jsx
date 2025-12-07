import React from "react";
import PropTypes from "prop-types";
import styles from "./Card.module.css";

export default function Card({
  children,
  padding = "md",
  hoverable = false,
  as: Component = "div",
  className = "",
  ...rest
}) {
  const paddingClass = styles[`card--padding-${padding}`] || styles["card--padding-md"];
  const hoverClass = hoverable ? styles["card--hoverable"] : "";

  return (
    <Component
      className={`${styles.card} ${paddingClass} ${hoverClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  padding: PropTypes.oneOf(["none", "sm", "md", "lg"]),
  hoverable: PropTypes.bool,
  as: PropTypes.elementType,
  className: PropTypes.string,
};
