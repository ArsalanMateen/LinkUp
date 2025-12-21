import React, { useCallback } from "react";
import { useAuth } from "../auth/AuthProvider";
import { read } from "./api";
import useResource from "../hooks/useResource";
import RequestState from "../components/RequestState";
import EditProfileForm from "../components/EditProfileForm";
import styles from "./EditProfile.module.css";
export default function EditProfile({ match, history }) {
  const { session } = useAuth();
  const userId = match.params.userId;
  const token = session?.token;
  const load = useCallback(
    (signal) => read({ userId }, { t: token }, signal),
    [userId, token],
  );
  const profile = useResource(load);
  if (session?.user._id !== userId)
    return <p role="alert">You can only edit your own profile.</p>;
  if (profile.loading || profile.error)
    return (
      <RequestState
        loading={profile.loading}
        error={profile.error}
        onRetry={profile.retry}
      />
    );
  const close = () => history.push("/user/" + userId);
  return (
    <div className={styles["edit-profile-page"]}>
      <div className={styles["edit-profile-page__card"]}>
        <h1 className={styles["edit-profile-page__title"]}>Edit Profile</h1>
        <EditProfileForm
          key={userId}
          user={profile.data}
          includeCredentials
          onCancel={close}
          onSaved={close}
        />
      </div>
    </div>
  );
}
