export function getUserId(user) {
  if (!user) {
    return null;
  }

  if (typeof user === "string") {
    const id = user.split("/").filter(Boolean).pop();
    return id ? Number(id) : null;
  }

  if (user.id !== undefined && user.id !== null) {
    if (typeof user.id === "number") {
      return user.id;
    }

    if (typeof user.id === "string") {
      if (user.id.includes("/")) {
        const id = user.id.split("/").filter(Boolean).pop();
        return id ? Number(id) : null;
      }

      const parsed = Number(user.id);
      return Number.isNaN(parsed) ? null : parsed;
    }
  }

  if (user["@id"]) {
    const id = user["@id"].split("/").filter(Boolean).pop();
    return id ? Number(id) : null;
  }

  return null;
}

export function getProfilePath(userOrId, currentUserId) {
  const userId =
    typeof userOrId === "number" || typeof userOrId === "string"
      ? Number(userOrId)
      : getUserId(userOrId);

  if (!userId || Number.isNaN(userId)) {
    return null;
  }

  if (currentUserId && userId === Number(currentUserId)) {
    return "/profile";
  }

  return `/profile/${userId}`;
}
