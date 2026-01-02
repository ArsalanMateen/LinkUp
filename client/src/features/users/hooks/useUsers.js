import { useCallback, useEffect, useRef, useState } from "react";
import { list } from "../api/usersApi";
import { getFriendlyErrorMessage } from "../../../shared/utils/error";

const initialState = () => ({
  users: [],
  nextCursor: null,
  hasMore: true,
  loading: true,
  loadingMore: false,
  error: "",
  loadMoreError: "",
});

const uniqueUsers = (users) => {
  const ids = new Set();

  return users.filter((user) => {
    if (ids.has(user._id)) return false;
    ids.add(user._id);
    return true;
  });
};

export default function useUsers() {
  const [state, setState] = useState(initialState);
  const mounted = useRef(false);
  const currentRequest = useRef(null);

  const fetchPage = useCallback(async (cursor = null, append = false) => {
    if (!mounted.current) return;

    currentRequest.current?.abort();
    const controller = new AbortController();
    currentRequest.current = controller;
    setState((previous) =>
      append
        ? { ...previous, loadingMore: true, loadMoreError: "" }
        : initialState(),
    );

    try {
      const page = await list({ limit: 20, cursor }, controller.signal);

      if (currentRequest.current !== controller || controller.signal.aborted) return;

      setState((previous) => ({
        ...previous,
        users: uniqueUsers([...(append ? previous.users : []), ...page.users]),
        nextCursor: page.nextCursor,
        hasMore: page.hasMore,
        loading: false,
        loadingMore: false,
        error: "",
        loadMoreError: "",
      }));
    } catch (error) {
      if (currentRequest.current !== controller || controller.signal.aborted) return;

      setState((previous) => ({
        ...previous,
        loading: false,
        loadingMore: false,
        [append ? "loadMoreError" : "error"]: getFriendlyErrorMessage(error),
      }));
    } finally {
      if (currentRequest.current === controller) currentRequest.current = null;
    }
  }, []);

  const refresh = useCallback(() => fetchPage(), [fetchPage]);

  useEffect(() => {
    mounted.current = true;
    refresh();

    return () => {
      mounted.current = false;
      currentRequest.current?.abort();
      currentRequest.current = null;
    };
  }, [refresh]);

  const loadMore = useCallback(() => {
    // Lock synchronously, before React can render the loading state.
    if (
      currentRequest.current ||
      state.loading ||
      !state.hasMore ||
      !state.nextCursor
    )
      return;

    return fetchPage(state.nextCursor, true);
  }, [fetchPage, state]);

  return { ...state, loadMore, refresh };
}
