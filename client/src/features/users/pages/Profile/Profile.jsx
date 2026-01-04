import React, { useCallback, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../../../auth/context/AuthProvider";
import useProfile from "../../hooks/useProfile";
import useProfilePosts from "../../../posts/hooks/useProfilePosts";
import useConnections from "../../hooks/useConnections";
import useFollowActions from "../../hooks/useFollowActions";
import Sidebar from "../../../../app/layout/Sidebar/Sidebar";
import ProfileHero from "../../components/ProfileHero/ProfileHero";
import AboutWidget from "../../components/AboutWidget/AboutWidget";
import FollowListWidget from "../../components/FollowListWidget/FollowListWidget";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
import FollowListModal from "../../components/FollowListModal/FollowListModal";
import AuthPromptModal from "../../../auth/components/AuthPromptModal/AuthPromptModal";
import PostList from "../../../posts/components/PostList/PostList";
import PostComposer from "../../../posts/components/PostComposer/PostComposer";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import styles from "./Profile.module.css";

export default function Profile({ match }) {
  const { session } = useAuth();
  const profile = useProfile(match.params.userId);
  const { user } = profile.data || {};
  const profilePosts = useProfilePosts(match.params.userId);
  const userId = match.params.userId;
  const [dialogState, setDialogState] = useState(null);
  const dialog = dialogState?.userId === userId ? dialogState.value : null;

  const setDialog = (value) => setDialogState({ userId, value });

  const followers = useConnections(userId, "followers", dialog === "Followers");
  const following = useConnections(userId, "following", dialog === "Following");
  const followersPreview = useConnections(
    userId,
    "followers",
    Boolean(user?.followersCount),
    5,
  );
  const followingPreview = useConnections(
    userId,
    "following",
    Boolean(user?.followingCount),
    5,
  );
  const [authAction, setAuthAction] = useState("");

  const requireAuth = useCallback((action) => setAuthAction(action), []);

  const followingAction = useFollowActions(
    profile,
    requireAuth,
    (target, followed, actor) => {
      followers.applyFollow(target, followed, actor);
      following.applyFollow(target, followed, actor);
      followersPreview.applyFollow(target, followed, actor);
      followingPreview.applyFollow(target, followed, actor);
    },
  );

  const connections = dialog === "Followers" ? followers : following;
  const { posts } = profilePosts;
  const postsCount =
    profilePosts.loading || (profilePosts.error && !posts.length)
      ? null
      : posts.length;
  const currentUserId = session?.user._id;
  const isOwner = Boolean(user && user._id === currentUserId);

  const withFollowOverrides = (people) =>
    people.map((person) => ({
      ...person,
      followedByMe:
        profile.data?.followOverrides[person._id] ?? person.followedByMe,
    }));

  return (
    <Container fluid="xl" className={styles.page}>
      <Row>
        <Col lg={3} md={4} className="d-none d-md-block">
          <Sidebar />
        </Col>

        <Col lg={6} md={8} xs={12}>
          <RequestState
            loading={profile.loading}
            error={profile.error}
            onRetry={profile.retry}
          />
          {user && (
            <ProfileHero
              user={user}
              postsCount={postsCount}
              postsCountHasMore={profilePosts.hasMore}
              isOwner={isOwner}
              isFollowing={Boolean(user.followedByMe)}
              pending={followingAction.pending}
              onFollowToggle={() => followingAction.toggle(user)}
              onOpenFollowList={setDialog}
            />
          )}
          {followingAction.error && <p role="alert">{followingAction.error}</p>}

          <h2 className={styles.sectionTitle}>Posts</h2>
          {isOwner && <PostComposer onPostCreated={profilePosts.prependPost} />}
          <PostList
            posts={posts}
            loading={profilePosts.loading && !posts.length}
            error={posts.length ? "" : profilePosts.error}
            onRetry={profilePosts.refresh}
            onRemove={profilePosts.removePost}
            onAuthRequired={requireAuth}
          />
          {posts.length > 0 && (
            <RequestState
              error={profilePosts.error}
              onRetry={profilePosts.refresh}
              inline
            />
          )}
          <div className="text-center mt-3">
            <RequestState
              error={profilePosts.loadMoreError}
              onRetry={profilePosts.loadMore}
              inline
            />
            <RequestState loading={profilePosts.loadingMore} inline />
            <button
              type="button"
              onClick={profilePosts.loadMore}
              disabled={
                !(
                  profilePosts.hasMore &&
                  !profilePosts.loading &&
                  !profilePosts.loadingMore &&
                  !profilePosts.error &&
                  !profilePosts.loadMoreError
                )
              }
            >
              Load more
            </button>
          </div>
        </Col>

        <Col lg={3} className="d-none d-lg-block">
          {user && (
            <>
              <AboutWidget
                user={user}
                isOwner={isOwner}
                onOpenEdit={() => setDialog("edit")}
              />
              <FollowListWidget
                title="Following"
                count={user.followingCount || 0}
                people={withFollowOverrides(followingPreview.users)}
                connections={followingPreview}
                onSeeAll={setDialog}
              />
              <FollowListWidget
                title="Followers"
                count={user.followersCount || 0}
                people={withFollowOverrides(followersPreview.users)}
                connections={followersPreview}
                onSeeAll={setDialog}
              />
            </>
          )}
        </Col>
      </Row>

      {dialog === "edit" && isOwner && (
        <EditProfileModal
          isOpen
          onClose={() => setDialog(null)}
          user={user}
          onProfileUpdated={(updatedUser) => {
            // Keep historical account-update graph arrays out of local profile data.
            const {
              followers: updatedFollowers,
              following: updatedFollowing,
              ...fields
            } = updatedUser;

            profile.setData((previous) => ({
              ...previous,
              user: {
                ...previous.user,
                ...fields,
                followersCount:
                  fields.followersCount ??
                  updatedFollowers?.length ??
                  previous.user.followersCount,
                followingCount:
                  fields.followingCount ??
                  updatedFollowing?.length ??
                  previous.user.followingCount,
              },
            }));
            profilePosts.updateAuthor(updatedUser);
          }}
        />
      )}
      {user && (
        <FollowListModal
          isOpen={dialog === "Following" || dialog === "Followers"}
          title={dialog === "Followers" ? "Followers" : "Following"}
          count={
            dialog === "Followers" ? user.followersCount : user.followingCount
          }
          connections={connections}
          people={withFollowOverrides(connections.users)}
          onClose={() => setDialog(null)}
        />
      )}
      <AuthPromptModal
        isOpen={Boolean(authAction)}
        actionName={authAction}
        onClose={() => setAuthAction("")}
      />
    </Container>
  );
}
