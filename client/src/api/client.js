const backendUrl = (import.meta.env?.VITE_API_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");
export const apiUrl = (path) =>
  `${backendUrl}${path.startsWith("/") ? path : `/${path}`}`;
export const avatarUrl = (user) => {
  if (!user || !user._id) return apiUrl("/api/users/defaultphoto");
  if (typeof user.photo === "string" && user.photo) return user.photo;
  if (user.photo && user.photo.url) return user.photo.url;
  return apiUrl(
    `/api/users/photo/${user._id}${user.updated ? `?v=${encodeURIComponent(user.updated)}` : ""}`,
  );
};

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function request(
  path,
  { token, json, validate, ...options } = {},
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
  if (response.status === 401 && token && typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("auth-session-expired", { detail: { token } }),
    );
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      response.ok
        ? "The server returned an invalid response. Please try again."
        : "Unable to reach the service. Please try again shortly.",
      response.status,
    );
  }
  if (!response.ok || data?.error) {
    throw new ApiError(
      typeof data?.error === "string"
        ? data.error
        : "The request failed. Please try again.",
      response.status,
    );
  }
  if (!data || (validate && !validate(data))) {
    throw new ApiError(
      "The server returned an unexpected response. Please try again.",
      response.status,
    );
  }
  return data;
}

export const isRecord = (data) => Boolean(data && typeof data._id === "string");
export const isList = (data) => Array.isArray(data) && data.every(isRecord);
