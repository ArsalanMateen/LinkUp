import { request, isRecord, isList } from "../api/client.js";

export const create = (user) =>
  request("/api/users/", {
    method: "POST",
    json: user,
    validate: (data) => typeof data.message === "string",
  });

export const list = (signal) =>
  request("/api/users/", { signal, validate: isList });

export const read = (params, credentials, signal) =>
  request("/api/users/" + params.userId, {
    token: credentials?.t,
    signal,
    validate: isRecord,
  });
