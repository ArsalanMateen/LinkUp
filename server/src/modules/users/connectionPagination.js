export { usersLimit as connectionsLimit } from "./userPagination.js";

// Same opaque base64url JSON convention as the other lists, with only an ID.
export const encodeConnectionCursor = (user) =>
  Buffer.from(JSON.stringify({ id: String(user._id) })).toString("base64url");

export const decodeConnectionCursor = (value) => {
  try {
    if (
      typeof value !== "string" ||
      !value.length ||
      value.length > 512 ||
      !/^[A-Za-z0-9_-]+$/.test(value)
    )
      throw new Error();

    const decoded = Buffer.from(value, "base64url");

    if (decoded.toString("base64url") !== value) throw new Error();

    const cursor = JSON.parse(decoded.toString("utf8"));

    if (
      !cursor ||
      typeof cursor.id !== "string" ||
      !/^[a-f\d]{24}$/i.test(cursor.id) ||
      Object.keys(cursor).length !== 1
    )
      throw new Error();

    return cursor.id;
  } catch {
    throw new Error("Invalid connections cursor");
  }
};
