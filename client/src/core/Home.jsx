import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../auth/AuthProvider";
import useResource from "../hooks/useResource";
import { listNewsFeed, listPublic } from "../post/api";
import Sidebar from "../components/Sidebar/Sidebar";
import PostComposer from "../components/PostComposer/PostComposer";
import PostList from "../components/PostList";
import DiscoverPeople from "../components/DiscoverPeople/DiscoverPeople";
import AuthPromptModal from "../components/AuthPromptModal/AuthPromptModal";
import logoImg from "../assets/images/logo.png";
import styles from "./Home.module.css";

export default function Home() {
  const { session: authSession } = useAuth();
  const [authModalAction, setAuthModalAction] = useState("");
  const token = authSession?.token;
  const userId = authSession?.user._id;
  const load = useCallback(
    (signal) =>
      userId
        ? listNewsFeed({ userId }, { t: token }, signal)
        : listPublic(signal),
    [userId, token],
  );
  const feed = useResource(load);
  useEffect(() => {
    window.addEventListener("feed-refresh-requested", feed.retry);
    return () =>
      window.removeEventListener("feed-refresh-requested", feed.retry);
  }, [feed.retry]);
  const handleAuthRequired = (action) =>
    setAuthModalAction(action || "interact with posts");
  const handlePostCreated = (post) => {
    if (feed.error || feed.loading) feed.retry();
    else feed.setData((posts) => [post, ...(posts || [])]);
  };
  const handlePostRemoved = (post) =>
    feed.setData((posts) => posts.filter((item) => item._id !== post._id));

  return (
    <Container fluid="xl" className={styles["home"]}>
      <Row>
        <Col lg={3} md={4} className="d-none d-md-block">
          <Sidebar />
        </Col>

        <Col lg={6} md={8} xs={12}>
          <div className={styles["home__feed-header"]}>
            <div className={styles["home__feed-titles"]}>
              <h1 className={styles["home__feed-title"]}>
                {authSession ? "Your Feed" : "Explore Community"}
              </h1>
              <p className={styles["home__feed-subtitle"]}>
                {authSession
                  ? "Ideas, progress, and people making a brighter tomorrow."
                  : "Discover thoughts, stories, and ideas from thinkers on LinkUp."}
              </p>
            </div>
          </div>

          {authSession ? (
            <PostComposer onPostCreated={handlePostCreated} />
          ) : (
            <div className={styles["home__guest-card"]}>
              <div className={styles["home__guest-top"]}>
                <img
                  src={logoImg}
                  alt="LinkUp"
                  width="44"
                  height="44"
                  style={{
                    width: "44px",
                    height: "44px",
                    maxWidth: "44px",
                    maxHeight: "44px",
                    objectFit: "contain",
                    flexShrink: 0,
                  }}
                  className={styles["home__guest-logo"]}
                />
                <div className={styles["home__guest-text"]}>
                  <h3 className={styles["home__guest-title"]}>
                    What&apos;s on your mind?
                  </h3>
                  <p className={styles["home__guest-subtitle"]}>
                    Join LinkUp to publish your ideas, ask questions, and share
                    progress.
                  </p>
                </div>
              </div>
              <div className={styles["home__guest-actions"]}>
                <Link
                  to="/signin"
                  className={styles["home__guest-btn--signin"]}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={styles["home__guest-btn--signup"]}
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}

          <PostList
            posts={feed.data || []}
            loading={feed.loading}
            error={feed.error}
            onRetry={feed.retry}
            onRemove={handlePostRemoved}
            onAuthRequired={handleAuthRequired}
          />
        </Col>

        <Col lg={3} className="d-none d-lg-block">
          <DiscoverPeople onAuthRequired={handleAuthRequired} />
        </Col>
      </Row>

      <AuthPromptModal
        isOpen={Boolean(authModalAction)}
        onClose={() => setAuthModalAction("")}
        actionName={authModalAction}
      />
    </Container>
  );
}
