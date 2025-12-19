import { useCallback, useEffect, useRef, useState } from "react";
import { listNewsFeed } from "../../posts/api/postsApi";
export default function useFeed({ userId, token }) {
  const [state, setState] = useState({
    posts: [],
    loading: true,
    loadingMore: false,
    hasMore: false,
    nextCursor: null,
    error: "",
  });
  const current = useRef(null);
  const fetchPage = useCallback(
    async (cursor = null) => {
      if (!userId) {
        setState({ posts: [], loading: false, hasMore: false });
        return;
      }
      current.current?.abort();
      const controller = new AbortController();
      current.current = controller;
      setState((previous) => ({
        ...previous,
        [cursor ? "loadingMore" : "loading"]: true,
        error: "",
      }));
      try {
        const page = await listNewsFeed(
          { userId, limit: 10, cursor },
          { t: token },
          controller.signal,
        );
        if (!controller.signal.aborted)
          setState((previous) => ({
            ...page,
            posts: cursor ? [...previous.posts, ...page.posts] : page.posts,
            loading: false,
            loadingMore: false,
            error: "",
          }));
      } catch (error) {
        if (!controller.signal.aborted)
          setState((previous) => ({
            ...previous,
            loading: false,
            loadingMore: false,
            error: error.message,
          }));
      } finally {
        if (current.current === controller) current.current = null;
      }
    },
    [userId, token],
  );
  const refresh = useCallback(() => fetchPage(), [fetchPage]);
  useEffect(() => {
    refresh();
    return () => current.current?.abort();
  }, [refresh]);
  return {
    ...state,
    refresh,
    loadMore: () => {
      if (!current.current && state.hasMore) return fetchPage(state.nextCursor);
    },
    prependPost: (post) =>
      setState((previous) => ({
        ...previous,
        posts: [post, ...previous.posts],
      })),
    removePost: (post) =>
      setState((previous) => ({
        ...previous,
        posts: previous.posts.filter((item) => item._id !== post._id),
      })),
  };
}
