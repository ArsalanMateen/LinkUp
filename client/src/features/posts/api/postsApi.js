import { request, isRecord, isList } from "../../../shared/api/client.js";

const isLikesResponse = (data) =>
  Number.isSafeInteger(data.likesCount) &&
  data.likesCount >= 0 &&
  typeof data.likedByMe === "boolean" &&
  !Object.hasOwn(data, "likes");

const isPostSummary = (post) =>
  isRecord(post) &&
  isLikesResponse(post) &&
  Number.isSafeInteger(post.commentCount) &&
  post.commentCount >= 0;

const isPostList = (data) => Array.isArray(data) && data.every(isPostSummary);

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
  request("/api/posts/public", { signal, validate: isPostList });

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
    validate: isPostSummary,
  });

const interaction = (action, params, credentials, postId, comment) =>
  request("/api/posts/" + action + "/", {
    method: "PUT",
    token: credentials.t,
    json: { postId, ...(comment ? { userId: params.userId, comment } : {}) },
    validate: comment ? isCommentsResponse : isLikesResponse,
  });

export const like = (params, credentials, postId) =>
  interaction("like", params, credentials, postId);

export const unlike = (params, credentials, postId) =>
  interaction("unlike", params, credentials, postId);

export const comment = (params, credentials, postId, comment) =>
  interaction("comment", params, credentials, postId, comment);

export const uncomment = (params, credentials, postId, comment) =>
  interaction("uncomment", params, credentials, postId, comment);

export const listComments = (postId, signal) =>
  request("/api/posts/" + encodeURIComponent(postId) + "/comments", {
    signal,
    validate: isCommentsResponse,
  });
