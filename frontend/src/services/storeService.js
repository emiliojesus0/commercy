import { getToken, getAuthHeaders } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

function buildStoreFormData(storeData) {
  const formData = new FormData();

  formData.append("nombre", storeData.nombre);
  formData.append("descripcion", storeData.descripcion);
  formData.append("color_fondo", storeData.color_fondo);

  if (storeData.logo) {
    formData.append("logo", storeData.logo);
  }

  return formData;
}

export async function createStore(storeData) {
  const token = getToken();
  const response = await fetch(`${API_URL}/stores`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: buildStoreFormData(storeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear la tienda");
  }

  return data;
}

export async function updateMyStore(storeData) {
  const token = getToken();
  const response = await fetch(`${API_URL}/stores/my/store`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: buildStoreFormData(storeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar la tienda");
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
