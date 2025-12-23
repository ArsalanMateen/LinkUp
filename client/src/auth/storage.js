import { signout } from "./api.js";
import { validSession } from "./session.js";
const notify = () => window.dispatchEvent(new Event("auth-session-changed"));
const auth = {
  getToken() {
    if (typeof window === "undefined") return null;
    try {
      sessionStorage.removeItem("jwt");
      const session = JSON.parse(localStorage.getItem("jwt") || "null");
      if (validSession(session)) return session;
      localStorage.removeItem("jwt");
    } catch {}
    return null;
  },
  isAuthenticated() {
    return Boolean(auth.getToken());
  },
  authenticate(session, callback) {
    if (!validSession(session))
      throw new Error("The server returned an invalid sign-in session.");
    try {
      localStorage.setItem("jwt", JSON.stringify(session));
      sessionStorage.removeItem("jwt");
    } catch {
      throw new Error(
        "Unable to save your session. Please allow browser storage and try again.",
      );
    }
    notify();
    callback?.();
  },
  updateUser(user) {
    const session = auth.getToken();
    if (session && user)
      auth.authenticate({ ...session, user: { ...session.user, ...user } });
  },
  clearLocal() {
    try {
      localStorage.removeItem("jwt");
      sessionStorage.removeItem("jwt");
    } catch {
      /* Storage may be disabled after the session was loaded. */
    } finally {
      notify();
    }
  },
  clearJWT(callback) {
    auth.clearLocal();
    callback?.();
    return signout().catch(() => undefined);
  },
};
export default auth;
