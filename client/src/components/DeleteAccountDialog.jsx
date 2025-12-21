import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "./common";
import useDeleteAccount from "../user/useDeleteAccount";

export default function DeleteAccountDialog({
  isOpen,
  onClose,
  userId,
  onDeleted,
}) {
  const { confirm, pending, error } = useDeleteAccount(userId, onDeleted);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      busy={pending}
      title="Delete Account"
      maxWidth="sm"
      footer={
        <>
          <Button
            variant="secondary"
            size="md"
            disabled={pending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            loading={pending}
            loadingText="Deleting…"
            onClick={confirm}
          >
            Confirm Delete
          </Button>
        </>
      }
    >
      <p
        style={{
          margin: "0 0 8px 0",
          color: "var(--color-text-secondary)",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        Are you sure you want to permanently delete your account? This action
        cannot be undone.
      </p>
      {error && (
        <p
          role="alert"
          style={{
            color: "var(--color-danger)",
            margin: "8px 0 0 0",
            fontSize: "13px",
          }}
        >
          {error}
        </p>
      )}
    </Modal>
  );
}

DeleteAccountDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  onDeleted: PropTypes.func.isRequired,
};
