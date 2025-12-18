import React from "react";
import PropTypes from "prop-types";
import Dialog from "../../Dialog";
import { Close as CloseIcon } from "../../Icons";
import styles from "./Modal.module.css";

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
}) {
  if (!isOpen) return null;

  const maxWidthClass =
    styles[`modal--max-width-${maxWidth}`] || styles["modal--max-width-md"];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      busy={busy}
      label={typeof title === "string" ? title : "Dialog"}
      overlayClassName={styles.modal__overlay}
      className={`${styles.modal__content} ${maxWidthClass} ${className}`.trim()}
    >
      {(title || showCloseButton) && (
        <div className={styles.modal__header}>
          {typeof title === "string" ? (
            <h2 className={styles.modal__title}>{title}</h2>
          ) : (
            title
          )}
          {showCloseButton && (
            <button
              type="button"
              className={styles["modal__close-btn"]}
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
            >
              <CloseIcon fontSize="small" />
            </button>
          )}
        </div>
      )}

      <div className={`${styles.modal__body} ${bodyClassName}`.trim()}>
        {children}
      </div>

      {footer && <div className={styles.modal__footer}>{footer}</div>}
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
