import React from "react";
import PropTypes from "prop-types";
import styles from "./AboutWidget.module.css";
import { MailOutline as MailOutlineIcon } from "../../../../shared/ui/Icons/Icons";

export default function AboutWidget({ user, isOwner, onOpenEdit }) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>About</h2>
        {isOwner && (
          <button
            type="button"
            className={styles.editButton}
            onClick={onOpenEdit}
          >
            Edit
          </button>
        )}
      </div>

      <p className={styles.bio}>
        {user.about || "No bio added yet."}
      </p>

      {user.email && (
        <div className={styles.contact}>
          <MailOutlineIcon className={styles.mailIcon} />
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
