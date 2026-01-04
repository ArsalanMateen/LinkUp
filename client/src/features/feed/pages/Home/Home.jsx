import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../../../auth/context/AuthProvider";
import useResource from "../../../../shared/hooks/useResource";
import useFeed from "../../hooks/useFeed";
import { listPublic } from "../../../posts/api/postsApi";
import RequestState from "../../../../shared/ui/RequestState/RequestState";
import Sidebar from "../../../../app/layout/Sidebar/Sidebar";
import PostComposer from "../../../posts/components/PostComposer/PostComposer";
import PostList from "../../../posts/components/PostList/PostList";
import DiscoverPeople from "../../../users/components/DiscoverPeople/DiscoverPeople";
import AuthPromptModal from "../../../auth/components/AuthPromptModal/AuthPromptModal";
import logoImg from "../../../../shared/assets/images/logo.png";
import styles from "./Home.module.css";

export default function Home() {
  const { session: authSession } = useAuth();
  const [authModalAction, setAuthModalAction] = useState("");

  const token = authSession?.token;
  const userId = authSession?.user._id;

  const authenticatedFeed = useFeed({ userId, token });

  const loadPublic = useCallback(
    (signal) => (userId ? Promise.resolve([]) : listPublic(signal)),
    [userId],
  );

  const publicFeed = useResource(loadPublic);

  const feed = userId ? authenticatedFeed : publicFeed;
  const posts = userId ? authenticatedFeed.posts : publicFeed.data || [];
  const refresh = userId ? authenticatedFeed.refresh : publicFeed.retry;

  useEffect(() => {
    window.addEventListener("feed-refresh-requested", refresh);

    return () => window.removeEventListener("feed-refresh-requested", refresh);
  }, [refresh]);

  const handleAuthRequired = useCallback(
    (action) => setAuthModalAction(action || "interact with posts"),
    [],
  );

  const handlePostCreated = authenticatedFeed.prependPost;
  const handlePostRemoved = authenticatedFeed.removePost;

  return (
    <Container fluid="xl" className={styles.page}>
      <Row>
        <Col lg={3} md={4} className="d-none d-md-block">
          <Sidebar />
        </Col>

        <Col lg={6} md={8} xs={12}>
          <div className={styles.feedHeader}>
            <div className={styles.feedTitles}>
              <h1 className={styles.feedTitle}>
                {authSession ? "Your Feed" : "Explore Community"}
              </h1>
              <p className={styles.feedSubtitle}>
                {authSession
                  ? "Ideas, progress, and people making a brighter tomorrow."
                  : "Discover thoughts, stories, and ideas from thinkers on LinkUp."}
              </p>
            </div>
          </div>

          {authSession ? (
            <PostComposer onPostCreated={handlePostCreated} />
          ) : (
            <div className={styles.guestCard}>
              <div className={styles.guestTop}>
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
                  className={styles.guestLogo}
                />
                <div className={styles.guestText}>
                  <h3 className={styles.guestTitle}>
                    What&apos;s on your mind?
                  </h3>
                  <p className={styles.guestSubtitle}>
                    Join LinkUp to publish your ideas, ask questions, and share
                    progress.
                  </p>
                </div>
              </div>
              <div className={styles.guestActions}>
                <Link to="/signin" className={styles.signInButton}>
                  Sign In
                </Link>
                <Link to="/signup" className={styles.signUpButton}>
                  Create Account
                </Link>
              </div>
            </div>
          )}

          <PostList
            posts={posts}
            loading={feed.loading && (!userId || !posts.length)}
            error={userId && posts.length ? "" : feed.error}
            onRetry={refresh}
            onRemove={handlePostRemoved}
            onAuthRequired={handleAuthRequired}
          />
          {userId && posts.length > 0 && (
            <RequestState error={feed.error} onRetry={refresh} inline />
          )}
          {userId && (
            <div className="text-center mt-3">
              <RequestState
                error={authenticatedFeed.paginationError}
                onRetry={authenticatedFeed.loadMore}
                inline
              />
              <RequestState loading={authenticatedFeed.loadingMore} inline />
              <button
                type="button"
                onClick={authenticatedFeed.loadMore}
                disabled={
                  !(
                    authenticatedFeed.hasMore &&
                    !authenticatedFeed.loading &&
                    !authenticatedFeed.loadingMore &&
                    !authenticatedFeed.error &&
                    !authenticatedFeed.paginationError
                  )
                }
              >
                Load more
              </button>
            </div>
          )}
        </Col>

        <Col lg={3} className="d-none d-lg-block">
          <DiscoverPeople />
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
