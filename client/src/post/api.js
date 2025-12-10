import { request, isList } from "../api/client.js";

export const listNewsFeed = (params, credentials, signal) =>
  request("/api/posts/feed/" + params.userId, {
    token: credentials.t,
    signal,
    validate: isList,
  });

export const listPublic = (signal) =>
  request("/api/posts/public", { signal, validate: isList });

export const listByUser = (params, credentials, signal) =>
  request("/api/posts/by/" + params.userId, {
    token: credentials?.t,
    signal,
    validate: isList,
  });
