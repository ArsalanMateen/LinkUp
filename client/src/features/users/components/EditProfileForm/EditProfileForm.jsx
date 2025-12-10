import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../auth/context/AuthProvider";
import { update } from "../../api/usersApi";
import { profileFormData } from "../../utils/profileForm";
import { avatarUrl } from "../../../../shared/api/client";
import useAction from "../../../../shared/hooks/useAction";
import styles from "../../pages/EditProfile/EditProfile.module.css";
import { Avatar, Button } from "../../../../shared/ui";

export default function EditProfileForm({
  user,
  includeCredentials = false,
  onSaved,
  onCancel,
  onPendingChange,
}) {
  const { session, updateUser } = useAuth();
  const fileInput = useRef(null);
  const [values, setValues] = useState({
    name: user.name || "",
    about: user.about || "",
    email: user.email || "",
    password: "",
    photo: null,
  });
  const [preview, setPreview] = useState(avatarUrl(user));
  const { run, pending, error } = useAction();

  useEffect(() => {
    onPendingChange?.(pending);
  }, [pending, onPendingChange]);

  useEffect(() => {
    if (!values.photo) {
      setPreview(avatarUrl(user));
      return;
    }

    const url = URL.createObjectURL(values.photo);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [values.photo, user]);

  const change = (name) => (event) =>
    setValues((previous) => ({ ...previous, [name]: event.target.value }));

  const field = (name, label, type = "text") => (
    <div className={styles.formGroup}>
      <label
        htmlFor={"profile-" + name}
        className={styles.label}
      >
        {label}
      </label>
      <input
        id={"profile-" + name}
        type={type}
        value={values[name]}
        onChange={change(name)}
        className={styles.input}
        required={name !== "password"}
        autoComplete={name === "password" ? "new-password" : name}
      />
    </div>
  );

  const submit = (event) => {
    event.preventDefault();
    run(async () => {
      if (!session || session.user._id !== user._id)
        throw new Error("Please sign in as the profile owner.");

      const saved = await update(
        { userId: user._id },
        { t: session.token },
        profileFormData(values, includeCredentials),
      );
      updateUser(saved);
      window.dispatchEvent(new Event("feed-refresh-requested"));
      onSaved(saved);
    });
  };

  return (
    <form
      onSubmit={submit}
      className={styles.form}
      aria-busy={pending}
    >
      <fieldset
        disabled={pending}
        style={{
          border: 0,
          padding: 0,
          margin: 0,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div className={styles.avatarSection}>
          <Avatar
            src={preview}
            alt="Avatar preview"
            size="xl"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInput.current.click()}
          >
            Change photo
          </Button>
          <input
            ref={fileInput}
            hidden
            id="profile-photo"
            type="file"
            accept="image/*"
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                photo: event.target.files[0] || null,
              }))
            }
          />
        </div>
        {field("name", "Full Name")}
        <div className={styles.formGroup}>
          <label
            htmlFor="profile-about"
            className={styles.label}
          >
            Bio
          </label>
          <textarea
            id="profile-about"
            value={values.about}
            onChange={change("about")}
            rows={3}
            className={styles.textarea}
          />
        </div>
        {includeCredentials && field("email", "Email Address", "email")}
        {includeCredentials &&
          field("password", "Password (optional)", "password")}
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={pending}
            loadingText="Saving…"
          >
            Save Changes
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
