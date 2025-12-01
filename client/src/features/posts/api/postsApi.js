import { request, isRecord, isList } from "../../../shared/api/client.js";

const isCommentsResponse = (data) =>
  isList(data.comments) &&
  data.comments.every((comment) => {
    const author = comment.postedBy;

    return (
      Boolean(comment._id) &&
      typeof comment.text === "string" &&
      (comment.created === undefined || typeof comment.created === "string") &&
      (author == null ||
        (isRecord(author) &&
          Boolean(author._id) &&
          typeof author.name === "string" &&
          (author.photo == null ||
            typeof author.photo === "string" ||
            (typeof author.photo === "object" &&
              (author.photo.url === undefined ||
                typeof author.photo.url === "string")))))
    );
  });

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

export const comment = (params, credentials, postId, comment) =>
  request("/api/posts/comment/", {
    method: "PUT",
    token: credentials.t,
    json: { userId: params.userId, postId, comment },
    validate: isCommentsResponse,
  });

export const uncomment = (params, credentials, postId, comment) =>
  request("/api/posts/uncomment/", {
    method: "PUT",
    token: credentials.t,
    json: { userId: params.userId, postId, comment },
    validate: isCommentsResponse,
  });

export const listComments = (postId, signal) =>
  request("/api/posts/" + encodeURIComponent(postId) + "/comments", {
    signal,
    validate: isCommentsResponse,
  });
