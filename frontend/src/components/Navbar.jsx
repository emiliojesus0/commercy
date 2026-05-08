import { Link, useNavigate } from "react-router-dom";
import {
  getToken,
  getUserActivo,
  getUserRole,
  logoutUser,
} from "../services/authService";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { getMyStore } from "../services/storeService";

function Navbar() {
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState("");

  const token = getToken();
  const userRole = getUserRole();
  const { cartItems } = useCart();
  const userActivo = getUserActivo() === "1";
  const totalCartItems = cartItems.reduce(
    (acc, item) => acc + item.cantidad,
    0,
  );

  useEffect(() => {
    const fetchStore = async () => {
      if (!token) {
        setStoreName("");
        return;
      }

      try {
        const store = await getMyStore();
        setStoreName(store.nombre);
      } catch (error) {
        setStoreName("");
      }
    };

    fetchStore();
  }, [token]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/cart">Carrito ({totalCartItems})</Link>
        </li>

        {!token ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Registro</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/dashboard">Panel</Link>
            </li>

            {userActivo && !storeName && (
              <li>
                <Link to="/create-store">Crear tienda</Link>
              </li>
            )}

            {userActivo && (
              <li>
                <Link to="/create-product">Crear producto</Link>
              </li>
            )}

            {userActivo && (
              <li>
                <Link to="/orders">Pedidos</Link>
              </li>
            )}

            {userRole === "admin" && (
              <li>
                <Link to="/admin/users">Admin</Link>
              </li>
            )}

            {storeName && (
              <li className="nav-store-name">Tienda: {storeName}</li>
            )}

            <li>
              <button type="button" onClick={handleLogout}>
                Cerrar sesion
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
