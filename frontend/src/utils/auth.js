const API_URL = "http://localhost:8000/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
}

export function isAdmin(user) {
  return user?.roles?.includes("ROLE_ADMIN") ?? false;
}

export async function fetchMe(token = getToken()) {
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
      }
      return null;
    }

    const data = await response.json();

    if (!data?.id || data.error) {
      clearAuth();
      return null;
    }

    localStorage.setItem("userId", String(data.id));
    return data;
  } catch {
    return null;
  }
}

export async function validateSession() {
  const token = getToken();
  if (!token) {
    clearAuth();
    return null;
  }

  const user = await fetchMe(token);
  if (!user) {
    clearAuth();
  }

  return user;
}

export function adminFetch(path, token, options = {}) {
  return fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (res.status === 401) {
      clearAuth();
      window.dispatchEvent(new Event("auth:logout"));
    }
    return res;
  });
}
