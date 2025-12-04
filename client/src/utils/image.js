import placeholder from "../assets/images/placeholder.png";

// Use a local fallback so an unavailable API cannot trigger another failed request.
export function fallbackAvatar(event) {
  const image = event.currentTarget;
  const fallback = new URL(placeholder, window.location.href).href;
  if (image.src !== fallback) image.src = fallback;
}
