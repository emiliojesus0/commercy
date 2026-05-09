const API_URL = "import.meta.env.VITE_API_URL";

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
    console.log("API_URL:", API_URL);
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
    throw new Error(data.message || "Error al iniciar sesion");
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
