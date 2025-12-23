export function sessionExpiry(session) {
  try {
    const payload = JSON.parse(
      atob(session.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return 0;
  }
}

export function validSession(session) {
  if (!session || typeof session.token !== "string" || !session.user?._id)
    return false;
  const expiry = sessionExpiry(session);
  return expiry === null || expiry > Date.now();
}
