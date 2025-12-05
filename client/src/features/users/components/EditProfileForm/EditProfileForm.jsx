import React, { useEffect, useState } from "react";
import { useAuth } from "../../../auth/context/AuthProvider";
import { update } from "../../api/usersApi";
import { profileFormData } from "../../utils/profileForm";
import useAction from "../../../../shared/hooks/useAction";
import { Button } from "../../../../shared/ui";
import styles from "../../pages/EditProfile/EditProfile.module.css";
export default function EditProfileForm({
  user,
  includeCredentials = false,
  onSaved,
  onCancel,
  onPendingChange,
}) {
  const { session, updateUser } = useAuth();
  const action = useAction();
  const [values, setValues] = useState({
    name: user.name || "",
    about: user.about || "",
    email: user.email || "",
    password: "",
  });
  useEffect(() => {
    onPendingChange?.(action.pending);
  }, [action.pending, onPendingChange]);
  const change = (name) => (event) =>
    setValues((previous) => ({ ...previous, [name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    action.run(async () => {
      if (session?.user._id !== user._id)
        throw new Error("Please sign in as the profile owner.");
      const saved = await update(
        { userId: user._id },
        { t: session.token },
        profileFormData(values, includeCredentials),
      );
      updateUser(saved);
      onSaved(saved);
    });
  };
  return (
    <form className={styles.form} onSubmit={submit}>
      <fieldset disabled={action.pending}>
        <label className={styles.label} htmlFor="profile-name">
          Full Name
        </label>
        <input
          id="profile-name"
          className={styles.input}
          value={values.name}
          onChange={change("name")}
          required
        />
        <label htmlFor="profile-about" className={styles.label}>
          Bio
        </label>
        <textarea
          id="profile-about"
          className={styles.textarea}
          value={values.about}
          onChange={change("about")}
        />
        {action.error && (
          <p role="alert" className={styles.error}>
            {action.error}
          </p>
        )}
        <div className={styles.actions}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" loading={action.pending}>
            Save Changes
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
