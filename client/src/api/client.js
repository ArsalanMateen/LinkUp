const backendUrl = (import.meta.env?.VITE_API_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");

export const apiUrl = (path) =>
  `${backendUrl}${path.startsWith("/") ? path : `/${path}`}`;

export const avatarUrl = (user) =>
  user?._id
    ? apiUrl(
        `/api/users/photo/${user._id}${user.updated ? `?v=${encodeURIComponent(user.updated)}` : ""}`,
      )
    : apiUrl("/api/users/defaultphoto");

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function request(
  path,
  { token, json, validate: _validate, ...options } = {},
) {
  const headers = { Accept: "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
    credentials: "include",
    ...(json !== undefined ? { body: JSON.stringify(json) } : {}),
  });
  const data = await response.json();
  if (!response.ok || data?.error) {
    throw new ApiError(
      data?.error || "The request failed. Please try again.",
      response.status,
    );
  }
  return data;
}

export const isRecord = (data) => Boolean(data && typeof data._id === "string");
export const isList = (data) => Array.isArray(data) && data.every(isRecord);
