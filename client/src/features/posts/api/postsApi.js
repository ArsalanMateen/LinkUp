import { request, isList } from "../../../shared/api/client.js";

export const listPublic = (signal) =>
  request("/api/posts/public", { signal, validate: isList });
