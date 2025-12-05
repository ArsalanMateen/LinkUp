import React from "react";
import PropTypes from "prop-types";
import Dialog from "../Dialog/Dialog";
import { Close as CloseIcon } from "../Icons/Icons";
import styles from "./Modal.module.css";

const widthClasses = new Map([
  ["sm", styles.maxWidthSm],
  ["md", styles.maxWidthMd],
  ["lg", styles.maxWidthLg],
]);

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "md",
  busy = false,
  showCloseButton = true,
  className = "",
  bodyClassName = "",
  bodyRef,
}) {
  if (!isOpen) return null;

  const maxWidthClass =
    widthClasses.get(String(maxWidth)) || styles.maxWidthMd;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      busy={busy}
      label={typeof title === "string" ? title : "Dialog"}
      overlayClassName={styles.overlay}
      className={`${styles.content} ${maxWidthClass} ${className}`.trim()}
    >
      {(title || showCloseButton) && (
        <div className={styles.header}>
          {typeof title === "string" ? (
            <h2 className={styles.title}>{title}</h2>
          ) : (
            title
          )}
          {showCloseButton && (
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
            >
              <CloseIcon fontSize="small" />
            </button>
          )}
        </div>
      )}

      <div ref={bodyRef} className={`${styles.body} ${bodyClassName}`.trim()}>
        {children}
      </div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </Dialog>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  maxWidth: PropTypes.oneOf(["sm", "md", "lg"]),
  busy: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
};
