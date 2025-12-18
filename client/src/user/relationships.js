export const personId = (person) => String(person?._id ?? person ?? "");
export const follows = (people, id) =>
  (people || []).some((person) => personId(person) === String(id));
export function updateFollowing(people, target, following) {
  const remaining = (people || []).filter(
    (person) => personId(person) !== personId(target),
  );
  return following ? [...remaining, target] : remaining;
}
// Only the actor's following list and target's followers are affected.
export function updateViewedProfile(viewed, actor, target, following) {
  if (!viewed) return viewed;
  if (personId(viewed) === personId(actor)) {
    return {
      ...viewed,
      following: updateFollowing(viewed.following, target, following),
    };
  }
  if (personId(viewed) === personId(target)) {
    return {
      ...viewed,
      followers: updateFollowing(viewed.followers, actor, following),
    };
  }
  return viewed;
}
