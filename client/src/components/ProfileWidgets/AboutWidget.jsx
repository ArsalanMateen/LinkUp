import React from "react";
import PropTypes from "prop-types";
import styles from "./AboutWidget.module.css";
import { MailOutline as MailOutlineIcon } from "../Icons";

export default function AboutWidget({ user, isOwner, onOpenEdit }) {
  return (
    <div className={styles["about-widget"]}>
      <div className={styles["about-widget__header"]}>
        <h2 className={styles["about-widget__title"]}>About</h2>
        {isOwner && (
          <button
            type="button"
            className={styles["about-widget__edit-btn"]}
            onClick={onOpenEdit}
          >
            Edit
          </button>
        )}
      </div>

      <p className={styles["about-widget__bio"]}>
        {user.about || "No bio added yet."}
      </p>

      {user.email && (
        <div className={styles["about-widget__contact"]}>
          <MailOutlineIcon className={styles["about-widget__mail-icon"]} />
          <span>{user.email}</span>
        </div>
      )}
    </div>
  );
}

AboutWidget.propTypes = {
  user: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
  onOpenEdit: PropTypes.func.isRequired,
};
