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

const isPostPage = (data) =>
  isPostList(data.posts) &&
  typeof data.hasMore === "boolean" &&
  (data.nextCursor === null || typeof data.nextCursor === "string") &&
  (data.hasMore
    ? data.posts.length > 0 && Boolean(data.nextCursor)
    : data.nextCursor === null);

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

export const listNewsFeed = (params, credentials, signal) => {
  const query = new URLSearchParams({ limit: params.limit ?? 10 });

  if (params.cursor != null) query.set("cursor", params.cursor);

  return request("/api/posts/feed/" + params.userId + "?" + query.toString(), {
    token: credentials.t,
    signal,
    validate: isPostPage,
  });
};

export const listPublic = (signal) =>
  request("/api/posts/public", { signal, validate: isPostList });

export const listByUser = (params, credentials, signal) => {
  const query = new URLSearchParams({ limit: params.limit ?? 10 });

  if (params.cursor != null) query.set("cursor", params.cursor);

  return request("/api/posts/by/" + params.userId + "?" + query.toString(), {
    token: credentials?.t,
    signal,
    validate: isPostPage,
  });
};

export const create = (params, credentials, post) =>
  request("/api/posts/new/" + params.userId, {
    method: "POST",
    token: credentials.t,
    body: post,
    validate: isPostSummary,
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
