import React from "react";
import useProfile from "../../hooks/useProfile";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import ProfileHero from "../../components/ProfileHero/ProfileHero";
import styles from "./Profile.module.css";
export default function Profile({ match }) {
  const profile = useProfile(match.params.userId);
  const user = profile.data?.user;
  return (
    <main className={styles.page}>
      {user && <ProfileHero user={user} />}
      <RequestState
        loading={profile.loading}
        error={profile.error}
        onRetry={profile.retry}
      />
    </main>
  );
}
