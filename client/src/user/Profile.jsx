import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../auth/AuthProvider";
import useProfile from "./useProfile";
import useFollowActions from "./useFollowActions";
import { follows } from "./relationships";
import Sidebar from "../components/Sidebar/Sidebar";
import ProfileHero from "../components/ProfileHero/ProfileHero";
import AboutWidget from "../components/ProfileWidgets/AboutWidget";
import FollowListWidget from "../components/ProfileWidgets/FollowListWidget";
import EditProfileModal from "../components/EditProfileModal/EditProfileModal";
import FollowListModal from "../components/FollowListModal/FollowListModal";
import AuthPromptModal from "../components/AuthPromptModal/AuthPromptModal";
import DeleteAccountDialog from "../components/DeleteAccountDialog";
import PostList from "../components/PostList";
import RequestState from "../components/RequestState";
import styles from "./Profile.module.css";

export default function Profile({ match, history }) {
  const { session } = useAuth();
  const profile = useProfile(match.params.userId);
  const [dialog, setDialog] = useState(null);
  const [authAction, setAuthAction] = useState("");
  const requireAuth = (action) => setAuthAction(action);
  const followingAction = useFollowActions(profile, requireAuth);
  if (profile.loading || profile.error)
    return (
      <Container fluid="xl" className={styles["profile-page"]}>
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
          </Col>
        </Row>
      </Container>
    );
  const { user, posts, currentUserFollowing } = profile.data;
  const currentUserId = session?.user._id;
  const isOwner = user._id === currentUserId;
  const followProps = {
    currentUserId,
    currentUserFollowing,
    onToggleFollow: followingAction.toggle,
    pending: followingAction.pending,
  };
  const onRemove = (post) =>
    profile.setData((previous) => ({
      ...previous,
      posts: previous.posts.filter((item) => item._id !== post._id),
    }));
  return (
    <Container fluid="xl" className={styles["profile-page"]}>
      <Row>
        <Col lg={3} md={4} className="d-none d-md-block">
          <Sidebar />
        </Col>
        <Col lg={6} md={8} xs={12}>
          <ProfileHero
            user={user}
            postsCount={posts.length}
            isOwner={isOwner}
            isFollowing={follows(currentUserFollowing, user._id)}
            pending={followingAction.pending}
            onFollowToggle={() => followingAction.toggle(user)}
            onOpenDelete={() => setDialog("delete")}
            onOpenFollowList={setDialog}
          />
          {followingAction.error && <p role="alert">{followingAction.error}</p>}
          <h2 className={styles["profile-page__section-title"]}>Posts</h2>
          <PostList
            posts={posts}
            onRemove={onRemove}
            onAuthRequired={requireAuth}
          />
        </Col>
        <Col lg={3} className="d-none d-lg-block">
          <AboutWidget
            user={user}
            isOwner={isOwner}
            onOpenEdit={() => setDialog("edit")}
          />
          <FollowListWidget
            {...followProps}
            title="Following"
            people={user.following}
            onSeeAll={setDialog}
          />
          <FollowListWidget
            {...followProps}
            title="Followers"
            people={user.followers}
            onSeeAll={setDialog}
          />
        </Col>
      </Row>
      {dialog === "edit" && isOwner && (
        <EditProfileModal
          isOpen
          onClose={() => setDialog(null)}
          user={user}
          onProfileUpdated={(updatedUser) =>
            profile.setData((previous) => ({
              ...previous,
              user: { ...previous.user, ...updatedUser },
            }))
          }
        />
      )}
      <FollowListModal
        {...followProps}
        isOpen={dialog === "Following" || dialog === "Followers"}
        title={dialog === "Followers" ? "Followers" : "Following"}
        error={followingAction.error}
        people={dialog === "Followers" ? user.followers : user.following}
        onClose={() => setDialog(null)}
      />
      {isOwner && dialog === "delete" && (
        <DeleteAccountDialog
          isOpen
          userId={user._id}
          onClose={() => setDialog(null)}
          onDeleted={() => history.push("/")}
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
