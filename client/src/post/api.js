import { request, isRecord, isList } from "../api/client.js";
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
export const create = (params, credentials, post) =>
  request("/api/posts/new/" + params.userId, {
    method: "POST",
    token: credentials.t,
    body: post,
    validate: isRecord,
  });
export const remove = (params, credentials) =>
  request("/api/posts/" + params.postId, {
    method: "DELETE",
    token: credentials.t,
    validate: isRecord,
  });
const interaction = (action, params, credentials, postId, comment) =>
  request("/api/posts/" + action + "/", {
    method: "PUT",
    token: credentials.t,
    json: { userId: params.userId, postId, ...(comment ? { comment } : {}) },
    validate: (data) =>
      isRecord(data) &&
      Array.isArray(data.likes) &&
      Array.isArray(data.comments),
  });
export const like = (params, credentials, postId) =>
  interaction("like", params, credentials, postId);
export const unlike = (params, credentials, postId) =>
  interaction("unlike", params, credentials, postId);
export const comment = (params, credentials, postId, comment) =>
  interaction("comment", params, credentials, postId, comment);
export const uncomment = (params, credentials, postId, comment) =>
  interaction("uncomment", params, credentials, postId, comment);
