const personId = (person) => String(person?._id ?? person ?? "");

// Only the actor's following count and target's followers count are affected.
export function updateViewedProfile(viewed, actor, target, following) {
  if (!viewed) return viewed;
  if (personId(viewed) === personId(actor)) {
    return {
      ...viewed,
      followingCount: Math.max(0, (viewed.followingCount || 0) + (following ? 1 : -1)),
    };
  }
  if (personId(viewed) === personId(target)) {
    return {
      ...viewed,
      followersCount: Math.max(0, (viewed.followersCount || 0) + (following ? 1 : -1)),
      followedByMe: following,
    };
  }

  return viewed;
}
