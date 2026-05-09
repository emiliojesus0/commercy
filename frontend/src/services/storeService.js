import { getAuthHeaders } from "./authService";

const API_URL = "import.meta.env.VITE_API_URL";

export async function createStore(storeData) {
  const response = await fetch(`${API_URL}/stores`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(storeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear la tienda");
  }

  return data;
}

export async function getStoreBySlug(slug) {
  const response = await fetch(`${API_URL}/stores/${slug}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener la tienda");
  }

  return data;
}

export async function getMyStore() {
  const response = await fetch(`${API_URL}/stores/my/store`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener tu tienda");
  }

  return data;
}
