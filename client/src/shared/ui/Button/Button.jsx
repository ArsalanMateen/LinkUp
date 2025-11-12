import React from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

const buttonClasses = new Map([
  ["sm", styles.sizeSm],
  ["md", styles.sizeMd],
  ["lg", styles.sizeLg],
  ["primary", styles.primary],
  ["outline", styles.outline],
  ["secondary", styles.secondary],
  ["danger", styles.danger],
  ["danger-outline", styles.dangerOutline],
  ["ghost", styles.ghost],
]);

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  disabled = false,
  type = "button",
  as: Component = "button",
  className = "",
  onClick,
  ...rest
}) {
  const variantClass = buttonClasses.get(String(variant)) || styles.primary;
  const sizeClass = buttonClasses.get(String(size)) || styles.sizeMd;

  const isButton = Component === "button";
  const compProps = isButton
    ? { type, disabled: disabled || loading }
    : { "aria-disabled": disabled || loading || undefined };

  return (
    <Component
      {...compProps}
      className={`${styles.root} ${variantClass} ${sizeClass} ${className}`.trim()}
      onClick={disabled || loading ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span>{loading && loadingText ? loadingText : children}</span>
    </Component>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "outline",
    "secondary",
    "danger",
    "danger-outline",
    "ghost",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  as: PropTypes.elementType,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
