import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/context/AuthProvider";
import { listConnections } from "../api/usersApi";
import { getFriendlyErrorMessage } from "../../../shared/utils/error";

const empty = () => ({
  users: [],
  nextCursor: null,
  hasMore: false,
  loading: false,
  loadingMore: false,
  error: "",
  loadMoreError: ""
});

const unique = (users) => [...new Map(users.map((user) => [user._id, user])).values()];

// Cache each bounded list in the mounted profile and fetch when its UI needs it.
export default function useConnections(userId, type, enabled, limit = 20) {
  const { session } = useAuth();
  const token = session?.token;

  const [state, setState] = useState(empty);
  const mounted = useRef(false),
    started = useRef(false),
    request = useRef(null);
  const activeLoader = useRef(null);
  const overrides = useRef(new Map());

  const fetchPage = useCallback(async (cursor = null, append = false) => {
    if (!mounted.current || activeLoader.current !== fetchPage) return;

    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    started.current = true;
    setState((previous) => ({
      ...(append ? previous : empty()),
      loader: fetchPage,
      [append ? "loadingMore" : "loading"]: true,
      loadMoreError: ""
    }));

    const applyOverrides = (users) => {
      const result = new Map(users.map((user) => [user._id, user]));

      for (const [id, change] of overrides.current) {
        if (change.remove) result.delete(id);
        else if (change.add || result.has(id))
          result.set(id, {
            ...(result.get(id) || change.user),
            followedByMe: change.following,
          });
      }

      return [...result.values()].sort((a, b) => a._id.localeCompare(b._id));
    };

    try {
      const page = await listConnections(
        { userId, type, limit, cursor },
        { t: token },
        controller.signal,
      );

      if (request.current !== controller || controller.signal.aborted) return;

      setState((previous) => ({
        ...previous,
        users: applyOverrides(
          unique([...(append ? previous.users : []), ...page.users]),
        ),
        nextCursor: page.nextCursor,
        hasMore: page.hasMore,
        loading: false,
        loadingMore: false,
        error: "",
        loadMoreError: "",
      }));
    } catch (error) {
      if (request.current !== controller || controller.signal.aborted) return;
      setState((previous) => ({
        ...previous,
        loading: false,
        loadingMore: false,
        [append ? "loadMoreError" : "error"]: getFriendlyErrorMessage(error)
      }));
    } finally {
      if (request.current === controller) request.current = null;
    }
  }, [userId, type, token, limit]);

  useEffect(() => {
    mounted.current = true;
    activeLoader.current = fetchPage;
    started.current = false;
    overrides.current = new Map();
    setState({ ...empty(), loader: fetchPage });

    return () => {
      mounted.current = false;
      activeLoader.current = null;
      request.current?.abort();
      request.current = null;
    };
  }, [fetchPage]);

  useEffect(() => {
    if (enabled && !started.current) fetchPage();
  }, [enabled, fetchPage]);

  const refresh = useCallback(() => fetchPage(), [fetchPage]);

  const loadMore = useCallback(() => {
    if (
      request.current ||
      state.loader !== fetchPage ||
      !state.hasMore ||
      !state.nextCursor
    )
      return;

    return fetchPage(state.nextCursor, true);
  }, [state, fetchPage]);

  const applyFollow = useCallback((target, following, actor) => {
    if (!mounted.current || activeLoader.current !== fetchPage) return;

    const ownFollowing = userId === actor._id && type === "following";
    const targetFollowers = userId === target._id && type === "followers";
    const person = targetFollowers ? actor : target;
    const membership = ownFollowing || targetFollowers;
    const change = {
      user: person,
      following: targetFollowers ? false : following,
      add: membership && following,
      remove: membership && !following
    };

    // Ignore late mutations from another profile/auth session.
    setState((previous) => {
      if (previous.loader !== fetchPage) return previous;

      overrides.current.set(person._id, change);
      const users = previous.users.filter((user) => user._id !== person._id);
      const existing = previous.users.find((user) => user._id === person._id);

      if (!change.remove && (existing || (change.add && started.current)))
        users.push({ ...(existing || person), followedByMe: change.following });

      return { ...previous, users: users.sort((a, b) => a._id.localeCompare(b._id)) };
    });
  }, [fetchPage, userId, type]);

  return {
    ...(state.loader === fetchPage ? state : empty()),
    refresh,
    loadMore,
    applyFollow
  };
}
