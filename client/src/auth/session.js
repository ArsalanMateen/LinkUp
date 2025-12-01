export function validSession(session) {
  return Boolean(
    session && typeof session.token === "string" && session.user?._id,
  );
}
