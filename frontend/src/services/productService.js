import { getToken } from "./authService";

const API_URL = "http://localhost:3000/api";

export async function createProduct(productData) {
  const token = getToken();

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

  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear el producto");
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
