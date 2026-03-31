function buildUrl(path, query) {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const url = new URL(`${base}${path}`, window.location.origin);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value == null) return;
      if (typeof value === "string" && value.trim() === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString().replace(window.location.origin, "");
}

function authHeaders(token) {
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function readErrorBody(res) {
  const text = await res.text().catch(() => "");
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function fetchFriendStatuses(userIds, token) {
  const ids = Array.isArray(userIds)
    ? userIds.filter((id) => id != null).map((id) => String(id)).join(",")
    : "";

  const res = await fetch(buildUrl("/api/friends/statuses", { userIds: ids }), {
    headers: { ...authHeaders(token) },
  });

  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(typeof body === "string" && body ? body : `Failed to load friend statuses (${res.status})`);
  }

  return res.json();
}

export async function sendFriendRequest(userId, token) {
  const res = await fetch(buildUrl("/api/friend-requests"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(typeof body === "string" && body ? body : `Failed to send friend request (${res.status})`);
  }

  return res.json();
}

export async function acceptFriendRequest(requestId, token) {
  const res = await fetch(buildUrl(`/api/friend-requests/${requestId}/accept`), {
    method: "POST",
    headers: { ...authHeaders(token) },
  });

  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(typeof body === "string" && body ? body : `Failed to accept friend request (${res.status})`);
  }

  return res.json();
}

export async function deleteFriendRequest(requestId, token) {
  const res = await fetch(buildUrl(`/api/friend-requests/${requestId}`), {
    method: "DELETE",
    headers: { ...authHeaders(token) },
  });

  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(typeof body === "string" && body ? body : `Failed to delete friend request (${res.status})`);
  }

  return res.json();
}

export async function unfriendUser(userId, token) {
  const res = await fetch(buildUrl(`/api/friends/${userId}`), {
    method: "DELETE",
    headers: { ...authHeaders(token) },
  });

  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(typeof body === "string" && body ? body : `Failed to delete friend (${res.status})`);
  }

  return res.json();
}
