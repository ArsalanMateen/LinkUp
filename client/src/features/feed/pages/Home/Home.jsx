import React from "react";
import styles from "./Home.module.css";
import { useCallback } from "react";
import useResource from "../../../../shared/hooks/useResource";
import { listPublic } from "../../../posts/api/postsApi";
import PostList from "../../../posts/components/PostList/PostList";
import { useAuth } from "../../../auth/context/AuthProvider";
import PostComposer from "../../../posts/components/PostComposer/PostComposer";
export default function Home() {
  const load = useCallback((signal) => listPublic(signal), []);
  const resource = useResource(load);
  const { session } = useAuth();
  return (
    <main className={styles.page}>
      <h1 className={styles.feedTitle}>Explore Community</h1>
      <PostList
        posts={resource.data || []}
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.retry}
      />
      {session && <PostComposer onPostCreated={() => resource.retry()} />}
    </main>
  );
}
