import { useCallback, useEffect, useRef, useState } from "react";
import { listNewsFeed } from "../../posts/api/postsApi";
import { getFriendlyErrorMessage } from "../../../shared/utils/error";

const initialState = (userId, token) => ({
  userId,
  token,
  posts: [],
  nextCursor: null,
  hasMore: Boolean(userId),
  loading: Boolean(userId),
  loadingMore: false,
  error: "",
  paginationError: "",
});

const uniquePosts = (posts) => {
  const ids = new Set();

  return posts.filter((post) => {
    if (ids.has(post._id)) return false;
    ids.add(post._id);
    return true;
  });
};

export default function useFeed({ userId, token }) {
  const [state, setState] = useState(() => initialState(userId, token));
  const mounted = useRef(null);
  const currentRequest = useRef(null);

  const fetchPage = useCallback(
    async (cursor = null, append = false) => {
      if (
        !userId ||
        mounted.current?.userId !== userId ||
        mounted.current?.token !== token
      )
        return;

      currentRequest.current?.controller.abort();
      const request = {
        controller: new AbortController(),
        prepended: [],
        removed: new Set(),
      };
      currentRequest.current = request;
      setState((previous) =>
        append
          ? { ...previous, loadingMore: true, paginationError: "" }
          : initialState(userId, token),
      );

      try {
        const page = await listNewsFeed(
          { userId, limit: 10, cursor },
          { t: token },
          request.controller.signal,
        );

        if (
          currentRequest.current !== request ||
          request.controller.signal.aborted
        )
          return;

        setState((previous) => ({
          ...previous,
          posts: uniquePosts([
            ...(append ? previous.posts : request.prepended),
            ...page.posts,
          ]).filter((post) => !request.removed.has(post._id)),
          nextCursor: page.nextCursor,
          hasMore: page.hasMore,
          loading: false,
          loadingMore: false,
          error: "",
          paginationError: "",
        }));
      } catch (error) {
        if (
          currentRequest.current !== request ||
          request.controller.signal.aborted
        )
          return;

        setState((previous) => ({
          ...previous,
          loading: false,
          loadingMore: false,
          [append ? "paginationError" : "error"]: getFriendlyErrorMessage(error),
        }));
      } finally {
        if (currentRequest.current === request) currentRequest.current = null;
      }
    },
    [userId, token],
  );

  const refresh = useCallback(() => fetchPage(), [fetchPage]);

  useEffect(() => {
    mounted.current = { userId, token };

    if (userId) refresh();
    else setState(initialState(userId, token));

    return () => {
      mounted.current = null;
      currentRequest.current?.controller.abort();
      currentRequest.current = null;
    };
  }, [refresh, userId, token]);

  const loadMore = useCallback(() => {
    // The ref locks immediately, before React can render the loading state.
    if (
      currentRequest.current ||
      state.userId !== userId ||
      state.token !== token ||
      state.loading ||
      !state.hasMore ||
      !state.nextCursor
    )
      return;

    return fetchPage(state.nextCursor, true);
  }, [fetchPage, state, userId, token]);

  const prependPost = useCallback(
    (post) => {
      if (
        !userId ||
        mounted.current?.userId !== userId ||
        mounted.current?.token !== token
      )
        return;

      const request = currentRequest.current;

      if (request) {
        request.prepended.unshift(post);
        request.removed.delete(post._id);
      }

      setState((previous) => ({
        ...previous,
        posts: [post, ...previous.posts.filter((item) => item._id !== post._id)],
      }));
    },
    [userId, token],
  );

  const removePost = useCallback(
    (post) => {
      if (
        !userId ||
        mounted.current?.userId !== userId ||
        mounted.current?.token !== token
      )
        return;

      currentRequest.current?.removed.add(post._id);
      setState((previous) => ({
        ...previous,
        posts: previous.posts.filter((item) => item._id !== post._id),
      }));
    },
    [userId, token],
  );

  return {
    ...(state.userId === userId && state.token === token
      ? state
      : initialState(userId, token)),
    loadMore,
    refresh,
    prependPost,
    removePost,
  };
}
