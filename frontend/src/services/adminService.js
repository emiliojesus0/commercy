import { getAuthHeaders } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export async function getAdminUsers() {
  const response = await fetch(`${API_URL}/admin/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener vendedores");
  }

  return data;
}

export async function activateUser(userId) {
  const response = await fetch(`${API_URL}/admin/users/${userId}/activate`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al activar vendedor");
  }

  return data;
}

export async function deactivateUser(userId) {
  const response = await fetch(`${API_URL}/admin/users/${userId}/deactivate`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al desactivar vendedor");
  }

  return data;
}
