import { useAuth } from "../../auth/context/AuthProvider";
import { follow, unfollow } from "../api/usersApi";
import { updateViewedProfile } from "../utils/relationships";
import useAction from "../../../shared/hooks/useAction";

export default function useFollowActions(profile, onAuthRequired, onChanged) {
  const { session } = useAuth();
  const action = useAction();

  const toggle = (target) => {
    if (!session) return onAuthRequired("follow members");
    if (!target?._id || target._id === session.user._id) return;

    const following = !(profile.data?.followOverrides[target._id] ?? target.followedByMe);

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
            followOverrides: { ...previous.followOverrides, [target._id]: following },
            user: updateViewedProfile(
              previous.user,
              session.user,
              target,
              following,
            ),
          },
      );
      onChanged?.(target, following, session.user);
      window.dispatchEvent(new Event("feed-refresh-requested"));
    });
  };

  return { ...action, toggle };
}
