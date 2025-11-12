import { request, isRecord, isList } from "../../../shared/api/client.js";

export const listPublic = (signal) =>
  request("/api/posts/public", { signal, validate: isList });

export const create = (params, credentials, post) =>
  request("/api/posts/new/" + params.userId, {
    method: "POST",
    token: credentials.t,
    body: post,
    validate: isRecord,
  });
