import { useCallback } from "react";
import useResource from "../../../shared/hooks/useResource";
import { listNewsFeed } from "../../posts/api/postsApi";
export default function useFeed({ userId, token }) {
  const load = useCallback(
    (signal) =>
      userId
        ? listNewsFeed({ userId }, { t: token }, signal)
        : Promise.resolve([]),
    [userId, token],
  );
  const resource = useResource(load);
  return {
    ...resource,
    posts: resource.data || [],
    refresh: resource.retry,
    prependPost: (post) =>
      resource.setData((previous) => [post, ...(previous || [])]),
    removePost: (post) =>
      resource.setData((previous) =>
        (previous || []).filter((item) => item._id !== post._id),
      ),
  };
}
