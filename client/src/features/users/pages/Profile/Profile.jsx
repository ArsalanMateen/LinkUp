import React, { useState } from "react";
import useProfile from "../../hooks/useProfile";
import useProfilePosts from "../../../posts/hooks/useProfilePosts";
import useConnections from "../../hooks/useConnections";
import useFollowActions from "../../hooks/useFollowActions";
import { useAuth } from "../../../auth/context/AuthProvider";
import ProfileHero from "../../components/ProfileHero/ProfileHero";
import FollowListWidget from "../../components/FollowListWidget/FollowListWidget";
import FollowListModal from "../../components/FollowListModal/FollowListModal";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
import AboutWidget from "../../components/AboutWidget/AboutWidget";
import PostList from "../../../posts/components/PostList/PostList";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import styles from "./Profile.module.css";
export default function Profile({ match }) {
  const id = match.params.userId;
  const profile = useProfile(id);
  const user = profile.data?.user;
  const posts = useProfilePosts(id);
  const { session } = useAuth();
  const [dialog, setDialog] = useState(null);
  const follow = useFollowActions(profile, () => {});
  const followers = useConnections(id, "followers", dialog === "Followers");
  const following = useConnections(id, "following", dialog === "Following");
  const followerPreview = useConnections(
    id,
    "followers",
    Boolean(user?.followersCount),
    5,
  );
  const followingPreview = useConnections(
    id,
    "following",
    Boolean(user?.followingCount),
    5,
  );
  const connections = dialog === "Followers" ? followers : following;
  const owner = user?._id === session?.user._id;
  return (
    <main className={styles.page}>
      <RequestState
        loading={profile.loading}
        error={profile.error}
        onRetry={profile.retry}
      />
      {user && (
        <>
          <ProfileHero
            user={user}
            postsCount={posts.posts.length}
            postsCountHasMore={posts.hasMore}
            isOwner={owner}
            isFollowing={user.followedByMe}
            pending={follow.pending}
            onFollowToggle={() => follow.toggle(user)}
            onOpenFollowList={setDialog}
          />
          <AboutWidget
            user={user}
            isOwner={owner}
            onOpenEdit={() => setDialog("edit")}
          />
          <FollowListWidget
            title="Following"
            count={user.followingCount || 0}
            people={followingPreview.users}
            connections={followingPreview}
            onSeeAll={setDialog}
          />
          <FollowListWidget
            title="Followers"
            count={user.followersCount || 0}
            people={followerPreview.users}
            connections={followerPreview}
            onSeeAll={setDialog}
          />
          <FollowListModal
            isOpen={dialog === "Following" || dialog === "Followers"}
            title={dialog === "Followers" ? "Followers" : "Following"}
            count={
              dialog === "Followers" ? user.followersCount : user.followingCount
            }
            people={connections.users}
            connections={connections}
            onClose={() => setDialog(null)}
          />
          {dialog === "edit" && owner && (
            <EditProfileModal
              isOpen
              user={user}
              onClose={() => setDialog(null)}
              onProfileUpdated={(saved) =>
                profile.setData((previous) => ({
                  ...previous,
                  user: { ...previous.user, ...saved },
                }))
              }
            />
          )}
        </>
      )}
      <PostList
        posts={posts.posts}
        loading={posts.loading}
        error={posts.error}
        onRetry={posts.refresh}
        onRemove={posts.removePost}
      />
      <button
        onClick={posts.loadMore}
        disabled={!posts.hasMore || posts.loadingMore}
      >
        Load more
      </button>
    </main>
  );
}
