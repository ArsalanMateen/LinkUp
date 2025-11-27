import { request, isRecord, isList } from "../../../shared/api/client.js";

export const create = (user) =>
  request("/api/users/", {
    method: "POST",
    json: user,
    validate: (data) => typeof data.message === "string",
  });

export const list = (params = {}, signal) =>
  request("/api/users", { signal, validate: isList });

export const read = (params, credentials, signal) =>
  request("/api/users/" + params.userId, {
    token: credentials?.t,
    signal,
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
