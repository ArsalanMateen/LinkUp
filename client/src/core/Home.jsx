import React, { useCallback, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../auth/AuthProvider";
import useResource from "../hooks/useResource";
import { listNewsFeed, listPublic } from "../post/api";
import Sidebar from "../components/Sidebar/Sidebar";
import PostComposer from "../components/PostComposer/PostComposer";
import PostList from "../components/PostList";
import AuthPromptModal from "../components/AuthPromptModal/AuthPromptModal";
import styles from "./Home.module.css";

export default function Home() {
  const { session } = useAuth();
  const [authAction, setAuthAction] = useState("");
  const load = useCallback(
    (signal) =>
      session
        ? listNewsFeed(
            { userId: session.user._id },
            { t: session.token },
            signal,
          )
        : listPublic(signal),
    [session],
  );
  const feed = useResource(load);
  const removePost = (post) =>
    feed.setData((posts) =>
      posts.filter((item) => item._id !== post._id),
    );
  const addPost = (post) =>
    feed.setData((posts) => [post, ...(posts || [])]);

  return (
    <Container fluid="xl" className={styles["home"]}>
      <Row>
        <Col lg={3} md={4} className="d-none d-md-block">
          <Sidebar />
        </Col>
        <Col lg={6} md={8} xs={12}>
          <h1>{session ? "Your Feed" : "Explore Community"}</h1>
          {session && <PostComposer onPostCreated={addPost} />}
          <PostList
            posts={feed.data || []}
            loading={feed.loading}
            error={feed.error}
            onRetry={feed.retry}
            onRemove={removePost}
            onAuthRequired={setAuthAction}
          />
        </Col>
      </Row>
      <AuthPromptModal
        isOpen={Boolean(authAction)}
        actionName={authAction}
        onClose={() => setAuthAction("")}
      />
    </Container>
  );
}
