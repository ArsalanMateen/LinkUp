const backendUrl = (import.meta.env?.VITE_API_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");
export const apiUrl = (path) =>
  `${backendUrl}${path.startsWith("/") ? path : `/${path}`}`;
export const isRecord = (data) => Boolean(data && typeof data._id === "string");
export const isList = (data) => Array.isArray(data) && data.every(isRecord);
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
  const data = await response.json();
  if (!response.ok || data?.error)
    throw new Error(data?.error || "The request failed. Please try again.");
  if (!data || (validate && !validate(data)))
    throw new Error(
      "The server returned an unexpected response. Please try again.",
    );
  return data;
}
