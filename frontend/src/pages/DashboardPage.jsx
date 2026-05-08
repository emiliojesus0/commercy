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
          Tu cuenta esta pendiente de activacion por un administrador. Cuando
          seas aprobado, podras crear tu tienda y publicar productos.
        </p>
      )}

      {store ? (
        <>
          <article>
            <h3>{store.nombre}</h3>
            <p>{store.descripcion || "Sin descripcion"}</p>
            <Link to={`/store/${store.slug}`}>Ver mi tienda publica</Link>
          </article>

          {userActivo && (
            <div className="dashboard-actions">
              <Link to="/create-product" className="dashboard-link">
                Crear producto
              </Link>
              <Link to="/orders" className="dashboard-link">
                Ver pedidos
              </Link>
            </div>
          )}
        </>
      ) : (
        <>
          <p>{error || "Todavia no tienes una tienda creada."}</p>

          {userActivo && (
            <div className="dashboard-actions">
              <Link to="/create-store" className="dashboard-link">
                Crear mi tienda
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default DashboardPage;
