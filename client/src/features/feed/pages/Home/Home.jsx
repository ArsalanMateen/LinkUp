import React from "react";
import styles from "./Home.module.css";
import { useCallback } from "react";
import useResource from "../../../../shared/hooks/useResource";
import { listPublic } from "../../../posts/api/postsApi";
import PostList from "../../../posts/components/PostList/PostList";
import { useAuth } from "../../../auth/context/AuthProvider";
import PostComposer from "../../../posts/components/PostComposer/PostComposer";
import useFeed from "../../hooks/useFeed";
import DiscoverPeople from "../../../users/components/DiscoverPeople/DiscoverPeople";
import Sidebar from "../../../../app/layout/Sidebar/Sidebar";
export default function Home() {
  const load = useCallback((signal) => listPublic(signal), []);
  const resource = useResource(load);
  const { session } = useAuth();
  const feed = useFeed({ userId: session?.user._id, token: session?.token });
  return (
    <main className={styles.page}>
      <Sidebar />
      <h1 className={styles.feedTitle}>Explore Community</h1>
      <PostList
        posts={session ? feed.posts : resource.data || []}
        loading={session ? feed.loading : resource.loading}
        error={session ? feed.error : resource.error}
        onRetry={session ? feed.refresh : resource.retry}
        onRemove={feed.removePost}
      />
      {session && <PostComposer onPostCreated={feed.prependPost} />}
      <DiscoverPeople />
    </main>
  );
}
