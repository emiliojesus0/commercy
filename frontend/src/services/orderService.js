import { getAuthHeaders } from "./authService";

const API_URL = "import.meta.env.VITE_API_URL";

export async function getMyStoreOrders() {
  const response = await fetch(`${API_URL}/stores/my/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener los pedidos");
  }

  return data;
}

export async function getMyStoreOrderDetail(orderId) {
  const response = await fetch(`${API_URL}/stores/my/orders/${orderId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener el detalle del pedido");
  }

  return data;
}

export async function createOrder(slug, orderData) {
  const response = await fetch(
    `http://localhost:3000/api/stores/${slug}/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear el pedido");
  }

  return data;
}

export async function updateMyStoreOrderStatus(orderId, estado) {
  const response = await fetch(
    `${API_URL}/stores/my/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ estado }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar el estado del pedido");
  }

  return data;
}
