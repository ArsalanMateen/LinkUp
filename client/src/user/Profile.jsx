import React from "react";
import useProfile from "./useProfile";
import PostList from "../components/PostList";
import RequestState from "../components/RequestState";

export default function Profile({ match }) {
  const profile = useProfile(match.params.userId);

  if (profile.loading || profile.error)
    return (
      <RequestState
        loading={profile.loading}
        error={profile.error}
        onRetry={profile.retry}
      />
    );

  return (
    <main>
      <h1>{profile.data.user.name}</h1>
      <p>{profile.data.user.about || "No bio added yet."}</p>
      <PostList posts={profile.data.posts} onRemove={() => {}} />
    </main>
  );
}
