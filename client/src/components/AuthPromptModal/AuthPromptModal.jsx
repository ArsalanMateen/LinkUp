import React from "react";
import Dialog from "../Dialog";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import logoImg from "../../assets/images/logo.png";
import { Button } from "../common";
import styles from "./AuthPromptModal.module.css";
import { Close as CloseIcon } from "../Icons";

export default function AuthPromptModal({ isOpen, onClose, actionName }) {
  if (!isOpen) return null;

  const actionText = actionName || "interact with posts";

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      label={"Sign in to continue"}
      overlayClassName={styles["auth-prompt-modal__overlay"]}
      className={styles["auth-prompt-modal__content"]}
    >
      <button
        type="button"
        className={styles["auth-prompt-modal__close-btn"]}
        onClick={onClose}
        aria-label="Close"
      >
        <CloseIcon fontSize="small" />
      </button>

      <img
        src={logoImg}
        alt="LinkUp"
        width="52"
        height="52"
        style={{
          width: "52px",
          height: "52px",
          maxWidth: "52px",
          maxHeight: "52px",
          objectFit: "contain",
          margin: "0 auto 14px",
          display: "block",
        }}
        className={styles["auth-prompt-modal__logo"]}
      />

      <h2 className={styles["auth-prompt-modal__title"]}>
        Join the Conversation
      </h2>

      <p className={styles["auth-prompt-modal__message"]}>
        Sign in or create a LinkUp account to {actionText} and connect with
        curious thinkers.
      </p>

      <div className={styles["auth-prompt-modal__actions"]}>
        <Button
          as={Link}
          to="/signin"
          variant="primary"
          size="md"
          onClick={onClose}
          className={styles["auth-prompt-modal__btn"]}
        >
          Sign In
        </Button>
        <Button
          as={Link}
          to="/signup"
          variant="outline"
          size="md"
          onClick={onClose}
          className={styles["auth-prompt-modal__btn"]}
        >
          Create an Account
        </Button>
      </div>

      <p className={styles["auth-prompt-modal__footer"]}>
        Takes less than 30 seconds
      </p>
    </Dialog>
  );
}

AuthPromptModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  actionName: PropTypes.string,
};
