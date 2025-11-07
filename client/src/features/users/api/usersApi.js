import { request, isRecord } from "../../../shared/api/client.js";

export const create = (user) =>
  request("/api/users/", {
    method: "POST",
    json: user,
    validate: (data) => typeof data.message === "string",
  });

export const read = (params, credentials, signal) =>
  request("/api/users/" + params.userId, {
    token: credentials?.t,
    signal,
    validate: isRecord,
  });
