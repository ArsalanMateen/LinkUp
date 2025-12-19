import React from "react";
import useProfile from "../../hooks/useProfile";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import ProfileHero from "../../components/ProfileHero/ProfileHero";
import styles from "./Profile.module.css";
import useProfilePosts from "../../../posts/hooks/useProfilePosts";
import PostList from "../../../posts/components/PostList/PostList";
import useFollowActions from "../../hooks/useFollowActions";
import { useAuth } from "../../../auth/context/AuthProvider";
import { useState } from "react";
import AboutWidget from "../../components/AboutWidget/AboutWidget";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
export default function Profile({ match }) {
  const profile = useProfile(match.params.userId);
  const user = profile.data?.user;
  const posts = useProfilePosts(match.params.userId);
  const { session } = useAuth();
  const follow = useFollowActions(profile, () => {});
  const [editing, setEditing] = useState(false);
  return (
    <main className={styles.page}>
      {user && (
        <ProfileHero
          user={user}
          postsCount={posts.posts.length}
          isOwner={user?._id === session?.user._id}
          isFollowing={Boolean(user?.followedByMe)}
          pending={follow.pending}
          onFollowToggle={() => follow.toggle(user)}
        />
      )}
      <RequestState
        loading={profile.loading}
        error={profile.error}
        onRetry={profile.retry}
      />
      <h2 className={styles.sectionTitle}>Posts</h2>
      <PostList
        posts={posts.posts}
        loading={posts.loading}
        error={posts.error}
        onRetry={posts.refresh}
        onRemove={posts.removePost}
      />
      {user && (
        <AboutWidget
          user={user}
          isOwner={user._id === session?.user._id}
          onOpenEdit={() => setEditing(true)}
        />
      )}
      {editing && user?._id === session?.user._id && (
        <EditProfileModal
          isOpen
          user={user}
          onClose={() => setEditing(false)}
          onProfileUpdated={(saved) =>
            profile.setData((previous) => ({
              ...previous,
              user: { ...previous.user, ...saved },
            }))
          }
        />
      )}
      <button
        onClick={posts.loadMore}
        disabled={posts.loadingMore || !posts.hasMore}
      >
        Load more
      </button>
    </main>
  );
}
