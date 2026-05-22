const API_URL = "http://localhost:8000/api";

export function isAdmin(user) {
  return user?.roles?.includes("ROLE_ADMIN") ?? false;
}

export async function fetchMe(token) {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export function adminFetch(path, token, options = {}) {
  return fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
