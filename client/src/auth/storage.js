import { signout } from "./api.js";
import { validSession } from "./session.js";

const notify = () => window.dispatchEvent(new Event("auth-session-changed"));

const auth = {
  getToken() {
    if (typeof window === "undefined") return null;
    try {
      const session = JSON.parse(localStorage.getItem("jwt") || "null");
      return validSession(session) ? session : null;
    } catch {
      return null;
    }
  },
  isAuthenticated() {
    return Boolean(auth.getToken());
  },
  authenticate(session, callback) {
    if (!validSession(session))
      throw new Error("The server returned an invalid sign-in session.");
    localStorage.setItem("jwt", JSON.stringify(session));
    notify();
    callback?.();
  },
  updateUser(user) {
    const session = auth.getToken();
    if (session && user)
      auth.authenticate({ ...session, user: { ...session.user, ...user } });
  },
  clearLocal() {
    localStorage.removeItem("jwt");
    notify();
  },
  clearJWT(callback) {
    auth.clearLocal();
    callback?.();
    return signout().catch(() => undefined);
  },
};

export default auth;
