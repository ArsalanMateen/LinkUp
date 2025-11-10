export const getHandle = (user) => {
  if (!user) return "@user";
  if (user.email && user.email.includes("@")) {
    const emailPrefix = user.email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    if (emailPrefix) return `@${emailPrefix}`;
  }
  if (user.name) {
    return `@${user.name.toLowerCase().replace(/\s+/g, "")}`;
  }

  return "@member";
};
