import { useAuth } from "../auth/AuthProvider";
import { follow, unfollow } from "./api";
import { follows, updateFollowing, updateViewedProfile } from "./relationships";
import useAction from "../hooks/useAction";

export default function useFollowActions(profile, onAuthRequired) {
  const { session } = useAuth();
  const action = useAction();
  const toggle = (target) => {
    if (!session) return onAuthRequired("follow members");
    if (!target?._id || target._id === session.user._id) return;
    const following = !follows(profile.data?.currentUserFollowing, target._id);
    return action.run(async () => {
      await (following ? follow : unfollow)(
        { userId: session.user._id },
        { t: session.token },
        target._id,
      );
      profile.setData(
        (previous) =>
          previous && {
            ...previous,
            currentUserFollowing: updateFollowing(
              previous.currentUserFollowing,
              target,
              following,
            ),
            user: updateViewedProfile(
              previous.user,
              session.user,
              target,
              following,
            ),
          },
      );
      window.dispatchEvent(new Event("feed-refresh-requested"));
    });
  };
  return { ...action, toggle };
}
