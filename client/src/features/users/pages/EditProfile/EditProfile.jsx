import React, { useCallback } from "react";
import { useAuth } from "../../../auth/context/AuthProvider";
import { read } from "../../api/usersApi";
import useResource from "../../../../shared/hooks/useResource";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import EditProfileForm from "../../components/EditProfileForm/EditProfileForm";
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
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Edit Profile</h1>
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
