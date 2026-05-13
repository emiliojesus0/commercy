import { getToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

function buildProductFormData(productData) {
  const formData = new FormData();

  formData.append("titulo", productData.titulo);
  formData.append("descripcion", productData.descripcion);
  formData.append("precio", productData.precio);
  formData.append("stock", productData.stock);
  formData.append("categoria", productData.categoria);
  formData.append("estado", productData.estado);

  if (productData.imagen) {
    formData.append("imagen", productData.imagen);
  }

  return formData;
}

export async function createProduct(productData) {
  const token = getToken();
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: buildProductFormData(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear el producto");
  }

  return data;
}

export async function getMyStoreProducts() {
  const token = getToken();
  const response = await fetch(`${API_URL}/products/my/products`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener tus productos");
  }

  return data;
}

export async function updateMyProduct(productId, productData) {
  const token = getToken();
  const response = await fetch(`${API_URL}/products/my/products/${productId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: buildProductFormData(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar el producto");
  }

  return data;
}

export async function deleteMyProduct(productId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/products/my/products/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar el producto");
  }

  return data;
}

export async function getStoreProducts(slug) {
  const response = await fetch(`${API_URL}/products/store/${slug}/products`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener los productos");
  }

  return data;
}
