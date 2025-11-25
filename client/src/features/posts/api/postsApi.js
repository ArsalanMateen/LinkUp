import { request, isRecord, isList } from "../../../shared/api/client.js";

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
    signal,
    token: credentials?.t,
    validate: isList,
  });

export const create = (params, credentials, post) =>
  request("/api/posts/new/" + params.userId, {
    method: "POST",
    token: credentials.t,
    body: post,
    validate: isRecord,
  });
