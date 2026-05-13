import { Link, useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();

  const [storeName, setStoreName] = useState("");

  const token = getToken();
  const userRole = getUserRole();
  const { cartItems } = useCart();
  const userActivo = getUserActivo() === "1";
  const totalCartItems = cartItems.reduce(
    (acc, item) => acc + item.cantidad,
    0,
  );
  const showCartLink = !token && location.pathname.startsWith("/store/");
  const isPublicStoreView = !token && location.pathname.startsWith("/store/");

  useEffect(() => {
    const fetchStore = async () => {
      if (!token) {
        setStoreName("");
        return;
      }

      try {
        const store = await getMyStore();
        setStoreName(store.nombre);
      } catch {
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
        <li className="nav-brand">
          <Link to="/" className="nav-brand-link">
            <img src="/favicon.png" alt="Commercy" className="nav-logo" />
            <span>Commercy</span>
          </Link>
        </li>

        {showCartLink && (
          <li>
            <Link to="/cart">Carrito ({totalCartItems})</Link>
          </li>
        )}

        {!token ? (
          <>
            <li>
              <Link to="/login">
                {isPublicStoreView ? "Acceso vendedores" : "Login"}
              </Link>
            </li>

            {!isPublicStoreView && (
              <li>
                <Link to="/register">Registro</Link>
              </li>
            )}
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
                Cerrar sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
