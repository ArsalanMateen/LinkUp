import { useCallback, useEffect, useRef, useState } from "react";
import { list } from "../api/usersApi";
export default function useUsers() {
  const [state, setState] = useState({
    users: [],
    loading: true,
    loadingMore: false,
    hasMore: false,
    nextCursor: null,
    error: "",
  });
  const current = useRef(null);
  const fetchPage = useCallback(async (cursor = null) => {
    current.current?.abort();
    const controller = new AbortController();
    current.current = controller;
    setState((previous) => ({
      ...previous,
      [cursor ? "loadingMore" : "loading"]: true,
      error: "",
    }));
    try {
      const page = await list({ limit: 20, cursor }, controller.signal);
      if (!controller.signal.aborted)
        setState((previous) => ({
          ...page,
          users: cursor ? [...previous.users, ...page.users] : page.users,
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
  }, []);
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
    prependUser: (post) =>
      setState((previous) => ({
        ...previous,
        users: [post, ...previous.users],
      })),
    removeUser: (post) =>
      setState((previous) => ({
        ...previous,
        users: previous.users.filter((item) => item._id !== post._id),
      })),
  };
}
