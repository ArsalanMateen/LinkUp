import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../auth/AuthProvider";
import useProfile from "./useProfile";
import Sidebar from "../components/Sidebar/Sidebar";
import ProfileHero from "../components/ProfileHero/ProfileHero";
import AboutWidget from "../components/ProfileWidgets/AboutWidget";
import PostList from "../components/PostList";
import RequestState from "../components/RequestState";
import styles from "./Profile.module.css";

export default function Profile({ match }) {
  const { session } = useAuth();
  const profile = useProfile(match.params.userId);

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

  const { user, posts } = profile.data;
  const isOwner = user._id === session?.user._id;

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
            isFollowing={false}
            pending={false}
            onFollowToggle={() => {}}
            onOpenDelete={() => {}}
            onOpenFollowList={() => {}}
          />
          <PostList posts={posts} onRemove={() => {}} />
        </Col>
        <Col lg={3} className="d-none d-lg-block">
          <AboutWidget
            user={user}
            isOwner={isOwner}
            onOpenEdit={() => {}}
          />
        </Col>
      </Row>
    </Container>
  );
}
