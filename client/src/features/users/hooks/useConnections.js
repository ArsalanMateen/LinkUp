import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/context/AuthProvider";
import { listConnections } from "../api/usersApi";
export default function useConnections(userId, type, enabled, limit = 20) {
  const { session } = useAuth();
  const token = session?.token;
  const current = useRef(null);
  const [state, setState] = useState({
    users: [],
    loading: false,
    loadingMore: false,
    error: "",
    loadMoreError: "",
    hasMore: false,
    nextCursor: null,
  });
  const fetchPage = useCallback(
    async (cursor = null) => {
      current.current?.abort();
      const controller = new AbortController();
      current.current = controller;
      setState((previous) => ({
        ...previous,
        [cursor ? "loadingMore" : "loading"]: true,
        error: "",
        loadMoreError: "",
      }));
      try {
        const page = await listConnections(
          { userId, type, limit, cursor },
          { t: token },
          controller.signal,
        );
        if (!controller.signal.aborted)
          setState((previous) => ({
            ...page,
            users: cursor ? [...previous.users, ...page.users] : page.users,
            loading: false,
            loadingMore: false,
            error: "",
            loadMoreError: "",
          }));
      } catch (error) {
        if (!controller.signal.aborted)
          setState((previous) => ({
            ...previous,
            loading: false,
            loadingMore: false,
            [cursor ? "loadMoreError" : "error"]: error.message,
          }));
      } finally {
        if (current.current === controller) current.current = null;
      }
    },
    [userId, type, limit, token],
  );
  useEffect(() => {
    if (enabled) fetchPage();
    return () => current.current?.abort();
  }, [enabled, fetchPage]);
  return {
    ...state,
    refresh: () => fetchPage(),
    loadMore: () => {
      if (!current.current && state.hasMore) return fetchPage(state.nextCursor);
    },
    applyFollow: () => {},
  };
}
