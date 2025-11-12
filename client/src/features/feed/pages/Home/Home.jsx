import React from "react";
import styles from "./Home.module.css";
import { useCallback } from "react";
import useResource from "../../../../shared/hooks/useResource";
import { listPublic } from "../../../posts/api/postsApi";
import PostList from "../../../posts/components/PostList/PostList";
export default function Home() {
  const load = useCallback((signal) => listPublic(signal), []);
  const resource = useResource(load);
  return (
    <main className={styles.page}>
      <h1 className={styles.feedTitle}>Explore Community</h1>
      <PostList
        posts={resource.data || []}
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.retry}
      />
    </main>
  );
}
