import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "../common";
import EditProfileForm from "../EditProfileForm";

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
}) {
  const [pending, setPending] = useState(false);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      busy={pending}
      title="Edit Profile"
      maxWidth="md"
    >
      {isOpen && (
        <EditProfileForm
          key={user._id}
          user={user}
          onCancel={onClose}
          onPendingChange={setPending}
          onSaved={(saved) => {
            onProfileUpdated(saved);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

EditProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  onProfileUpdated: PropTypes.func.isRequired,
};
