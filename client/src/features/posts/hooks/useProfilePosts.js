import { useCallback } from "react";
import { useAuth } from "../../auth/context/AuthProvider";
import useResource from "../../../shared/hooks/useResource";
import { listByUser } from "../api/postsApi";
export default function useProfilePosts(userId) {
  const { session } = useAuth();
  const token = session?.token;
  const load = useCallback(
    (signal) => listByUser({ userId }, { t: token }, signal),
    [userId, token],
  );
  const resource = useResource(load);
  return {
    ...resource,
    posts: resource.data || [],
    refresh: resource.retry,
    removePost: (post) =>
      resource.setData((previous) =>
        (previous || []).filter((item) => item._id !== post._id),
      ),
  };
}
