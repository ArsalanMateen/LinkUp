import React from "react";
import PropTypes from "prop-types";
import styles from "./Card.module.css";

const paddingClasses = new Map([
  ["none", styles.paddingNone],
  ["sm", styles.paddingSm],
  ["md", styles.paddingMd],
  ["lg", styles.paddingLg],
]);

export default function Card({
  children,
  padding = "md",
  hoverable = false,
  as: Component = "div",
  className = "",
  ...rest
}) {
  const paddingClass = paddingClasses.get(String(padding)) || styles.paddingMd;
  const hoverClass = hoverable ? styles.hoverable : "";

  return (
    <Component
      className={`${styles.root} ${paddingClass} ${hoverClass} ${className}`.trim()}
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
