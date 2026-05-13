import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyStore } from "../services/storeService";
import { getUserActivo } from "../services/authService";

function DashboardPage() {
  const [store, setStore] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const userActivo = getUserActivo() === "1";

  useEffect(() => {
    const fetchMyStore = async () => {
      try {
        const data = await getMyStore();
        setStore(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStore();
  }, []);

  if (loading) {
    return <p>Cargando panel...</p>;
  }

  return (
    <section>
      <h2>Panel del vendedor</h2>

      {!userActivo && (
        <p className="message-error">
          Tu cuenta está pendiente de activación por un administrador. Cuando
          seas aprobado, podrás crear tu tienda y publicar productos.
        </p>
      )}

      {store ? (
        <>
          <article>
            <h3>{store.nombre}</h3>
            <p>{store.descripcion || "Sin descripción"}</p>
            <Link to={`/store/${store.slug}`}>Ver mi tienda pública</Link>
          </article>

          {userActivo && (
            <div className="dashboard-actions">
              <Link to="/create-product" className="dashboard-link">
                Gestionar productos
              </Link>
              <Link to="/orders" className="dashboard-link">
                Gestionar pedidos
              </Link>
              <Link to="/account" className="dashboard-link">
                Mi cuenta y tienda
              </Link>
            </div>
          )}
        </>
      ) : (
        <>
          <p>{error || "Todavía no tienes una tienda creada."}</p>

          {userActivo && (
            <div className="dashboard-actions">
              <Link to="/create-store" className="dashboard-link">
                Crear mi tienda
              </Link>
              <Link to="/account" className="dashboard-link">
                Mi cuenta
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default DashboardPage;
