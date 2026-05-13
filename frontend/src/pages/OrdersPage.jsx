import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyStoreOrders } from "../services/orderService";

function formatDateTime(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Date(value).toLocaleString("es-EC", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

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
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{pedido.cliente_nombre}</td>
                  <td>{pedido.cliente_telefono}</td>
                  <td>{pedido.direccion}</td>
                  <td>{pedido.estado}</td>
                  <td>${Number(pedido.total).toFixed(2)}</td>
                  <td>{formatDateTime(pedido.created_at)}</td>
                  <td>
                    <Link to={`/orders/${pedido.id}`}>Ver detalle</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default OrdersPage;
