// The directory shares A/F's cursor format and validation. Its lighter cards
// have a distinct page-size policy (20 by default, at most 50).
export {
  encodeFeedCursor as encodeUserCursor,
  decodeFeedCursor as decodeUserCursor,
} from "../posts/feedPagination.js";

export const usersLimit = (value) => {
  if (value === undefined) return 20;
  if (typeof value !== "string" || !/^-?\d+$/.test(value))
    throw new Error("Invalid users limit");

  const limit = Number(value);

  if (!Number.isSafeInteger(limit)) throw new Error("Invalid users limit");

  return Math.min(50, Math.max(1, limit));
};
