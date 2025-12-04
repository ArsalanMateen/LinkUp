import { request } from "../api/client.js";
import { validSession } from "./session.js";
export const signin = (user) =>
  request("/auth/signin/", {
    method: "POST",
    json: user,
    validate: validSession,
  });
export const signout = () =>
  request("/auth/signout/", {
    validate: (data) => typeof data.message === "string",
  });
