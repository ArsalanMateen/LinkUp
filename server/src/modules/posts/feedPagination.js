export const feedLimit = (value) => {
  if (value === undefined) return 10;
  if (typeof value !== "string" || !/^-?\d+$/.test(value))
    throw new Error("Invalid feed limit");

  const limit = Number(value);

  if (!Number.isSafeInteger(limit)) throw new Error("Invalid feed limit");

  return Math.min(20, Math.max(1, limit));
};

export const encodeFeedCursor = (post) =>
  Buffer.from(
    JSON.stringify({ created: post.created.toISOString(), id: String(post._id) }),
  ).toString("base64url");

export const decodeFeedCursor = (value) => {
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
      typeof cursor.created !== "string" ||
      typeof cursor.id !== "string" ||
      !/^[a-f\d]{24}$/i.test(cursor.id)
    )
      throw new Error();

    const created = new Date(cursor.created);

    if (
      !Number.isFinite(created.getTime()) ||
      created.toISOString() !== cursor.created
    )
      throw new Error();

    return { created, id: cursor.id };
  } catch {
    throw new Error("Invalid feed cursor");
  }
};
