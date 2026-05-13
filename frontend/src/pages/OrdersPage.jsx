import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyStoreOrders } from "../services/orderService";

function OrdersPage() {
  const [tienda, setTienda] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyStoreOrders();
        setTienda(data.tienda);
        setPedidos(data.pedidos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Cargando pedidos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Pedidos</h2>

      {tienda && (
        <p>
          Tienda: <strong>{tienda.nombre}</strong>
        </p>
      )}

      {pedidos.length === 0 ? (
        <p>No hay pedidos todavía.</p>
      ) : (
        <div>
          {pedidos.map((pedido) => (
            <article key={pedido.id}>
              <h3>Pedido #{pedido.id}</h3>
              <p>Cliente: {pedido.cliente_nombre}</p>
              <p>Teléfono: {pedido.cliente_telefono}</p>
              <p>Dirección: {pedido.direccion}</p>
              <p>Estado: {pedido.estado}</p>
              <p>Total: ${pedido.total}</p>
              <Link to={`/orders/${pedido.id}`}>Ver detalle</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrdersPage;
