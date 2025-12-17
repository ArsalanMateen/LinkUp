import { useCallback } from "react";
import { read } from "./api";
import { listByUser } from "../post/api";
import { useAuth } from "../auth/AuthProvider";
import useResource from "../hooks/useResource";

export default function useProfile(userId) {
  const { session } = useAuth();
  const token = session?.token;
  const actorId = session?.user._id;
  const load = useCallback(
    async (signal) => {
      const [user, posts, actor] = await Promise.all([
        read({ userId }, { t: token }, signal),
        listByUser({ userId }, { t: token }, signal),
        actorId && actorId !== userId
          ? read({ userId: actorId }, { t: token }, signal)
          : null,
      ]);
      return {
        user: {
          ...user,
          following: (user.following || []).filter(Boolean),
          followers: (user.followers || []).filter(Boolean),
        },
        posts: (posts || []).map((p) => ({
          ...p,
          postedBy:
            p.postedBy && !p.postedBy.photo
              ? { ...p.postedBy, photo: user.photo }
              : p.postedBy,
        })),
        currentUserFollowing:
          (actor || (actorId === userId ? user : null))?.following || [],
      };
    },
    [userId, actorId, token],
  );
  return useResource(load);
}
