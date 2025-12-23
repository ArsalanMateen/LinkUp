import { request, isRecord, isList } from "../../../shared/api/client.js";

export const create = (user) =>
  request("/api/users/", {
    method: "POST",
    json: user,
    validate: (data) => typeof data.message === "string",
  });

export const list = (params = {}, signal) => {
  const query = new URLSearchParams({ limit: params.limit ?? 20 });

  if (params.cursor != null) query.set("cursor", params.cursor);

  return request("/api/users?" + query.toString(), {
    signal,
    validate: (data) =>
      isList(data.users) &&
      typeof data.hasMore === "boolean" &&
      (data.nextCursor === null || typeof data.nextCursor === "string") &&
      (data.hasMore
        ? data.users.length > 0 && Boolean(data.nextCursor)
        : data.nextCursor === null),
  });
};

export const read = (params, credentials, signal) =>
  request("/api/users/" + params.userId, {
    token: credentials?.t,
    signal,
    validate: isRecord,
  });

export const update = (params, credentials, user) =>
  request("/api/users/" + params.userId, {
    method: "PUT",
    token: credentials.t,
    body: user,
    validate: isRecord,
  });

export const remove = (params, credentials) =>
  request("/api/users/" + params.userId, {
    method: "DELETE",
    token: credentials.t,
    validate: isRecord,
  });

export const follow = (params, credentials, followId) =>
  request("/api/users/follow/", {
    method: "PUT",
    token: credentials.t,
    json: { userId: params.userId, followId },
    validate: isRecord,
  });

export const unfollow = (params, credentials, unfollowId) =>
  request("/api/users/unfollow/", {
    method: "PUT",
    token: credentials.t,
    json: { userId: params.userId, unfollowId },
    validate: isRecord,
  });

export const findPeople = (params, credentials, signal) =>
  request("/api/users/findpeople/" + params.userId, {
    token: credentials.t,
    signal,
    validate: isList,
  });
