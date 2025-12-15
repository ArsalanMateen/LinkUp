import React, { useState, useRef, useEffect } from "react";
import useAction from "../../hooks/useAction";
import PropTypes from "prop-types";
import { useAuth } from "../../auth/AuthProvider";
import { create } from "../../post/api";
import { Avatar, Button, Card } from "../common";
import styles from "./PostComposer.module.css";
import { ImageOutlined as ImageOutlinedIcon } from "../Icons";
import { Close as CloseIcon } from "../Icons";

export default function PostComposer({ onPostCreated }) {
  const auth = useAuth();
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const action = useAction();
  const { error, pending: submitting } = action;
  const fileInputRef = useRef(null);

  const authSession = auth.session;
  const currentUser = authSession ? authSession.user : {};
  const firstName =
    currentUser && currentUser.name ? currentUser.name.split(" ")[0] : "there";

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!photo) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    action.run(async () => {
      if (!authSession) throw new Error("Please sign in to create a post.");
      const data = new FormData();
      data.append("text", text.trim());
      if (photo) data.append("photo", photo);
      const post = await create(
        { userId: currentUser._id },
        { t: authSession.token },
        data,
      );
      setText("");
      handleRemovePhoto();
      onPostCreated(post);
    });
  };

  return (
    <Card padding="md" className={styles["post-composer"]}>
      <form onSubmit={handleSubmit}>
        <div className={styles["post-composer__top"]}>
          <Avatar user={currentUser} size="md" />
          <div className={styles["post-composer__input-wrap"]}>
            <textarea
              aria-label="Post text"
              disabled={submitting}
              className={styles["post-composer__textarea"]}
              placeholder={`What's on your mind, ${firstName}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
            />

            {previewUrl && (
              <div className={styles["post-composer__preview"]}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className={styles["post-composer__preview-img"]}
                />
                <button
                  type="button"
                  className={styles["post-composer__remove-img"]}
                  disabled={submitting}
                  onClick={handleRemovePhoto}
                  aria-label="Remove image"
                >
                  <CloseIcon style={{ fontSize: 16 }} />
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div role="alert" className={styles["post-composer__error"]}>
            {error}
          </div>
        )}

        <div className={styles["post-composer__bottom"]}>
          <input
            disabled={submitting}
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handlePhotoChange}
            className={styles["post-composer__file-input"]}
            id="post-composer-file"
          />
          <label
            htmlFor="post-composer-file"
            className={styles["post-composer__add-img-btn"]}
          >
            <ImageOutlinedIcon className={styles["post-composer__img-icon"]} />
            <span>{photo ? "Change image" : "Add an image"}</span>
          </label>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!text.trim() || submitting}
            loading={submitting}
            loadingText="Posting..."
          >
            Post
          </Button>
        </div>
      </form>
    </Card>
  );
}

PostComposer.propTypes = {
  onPostCreated: PropTypes.func.isRequired,
};
