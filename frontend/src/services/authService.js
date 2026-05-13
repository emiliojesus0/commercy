const API_URL = import.meta.env.VITE_API_URL;

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al registrar usuario");
  }

  return data;
}

export async function loginUser(userData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  return data;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userActivo");
}

export function getUserRole() {
  return localStorage.getItem("userRole");
}

export function getUserActivo() {
  return localStorage.getItem("userActivo");
}

export async function getMyProfile() {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener la cuenta");
  }

  return data;
}

export async function updateMyProfile(profileData) {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar la cuenta");
  }

  return data;
}

export async function updateMyPassword(passwordData) {
  const response = await fetch(`${API_URL}/users/me/password`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(passwordData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar la contraseña");
  }

  return data;
}
