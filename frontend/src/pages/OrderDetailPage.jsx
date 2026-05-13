import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMyStoreOrderDetail,
  updateMyStoreOrderStatus,
} from "../services/orderService";

function formatDateTime(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Date(value).toLocaleString("es-EC", {
    dateStyle: "full",
    timeStyle: "short",
  });
}

function OrderDetailPage() {
  const { orderId } = useParams();
  const [tienda, setTienda] = useState(null);
  const [pedido, setPedido] = useState(null);
  const [detalle, setDetalle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState("");

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await getMyStoreOrderDetail(orderId);
        setTienda(data.tienda);
        setPedido(data.pedido);
        setNuevoEstado(data.pedido.estado);
        setDetalle(data.detalle);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleUpdateStatus = async (event) => {
    event.preventDefault();
    setMensajeEstado("");
    setError("");

    try {
      setActualizandoEstado(true);
      await updateMyStoreOrderStatus(orderId, nuevoEstado);
      setPedido((prev) => ({
        ...prev,
        estado: nuevoEstado,
      }));
      setMensajeEstado("Estado actualizado correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setActualizandoEstado(false);
    }
  };

  if (loading) {
    return <p>Cargando detalle del pedido...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Detalle del pedido</h2>

      {tienda && (
        <p>
          Tienda: <strong>{tienda.nombre}</strong>
        </p>
      )}

      {pedido && (
        <article>
          <h3>Pedido #{pedido.id}</h3>
          <p>Cliente: {pedido.cliente_nombre}</p>
          <p>Email: {pedido.cliente_email || "No especificado"}</p>
          <p>Teléfono: {pedido.cliente_telefono}</p>
          <p>Dirección: {pedido.direccion}</p>
          <p>Notas: {pedido.notas || "Sin notas"}</p>
          <p>Estado: {pedido.estado}</p>
          <p>Total: ${Number(pedido.total).toFixed(2)}</p>
          <p>Fecha del pedido: {formatDateTime(pedido.created_at)}</p>

          <form onSubmit={handleUpdateStatus}>
            <div>
              <label htmlFor="estado">Actualizar estado</label>
              <select
                id="estado"
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>

            <button type="submit" disabled={actualizandoEstado}>
              {actualizandoEstado ? "Actualizando..." : "Actualizar estado"}
            </button>
          </form>

          {mensajeEstado && (
            <p className="message-success">{mensajeEstado}</p>
          )}
        </article>
      )}

      <section className="table-section">
        <h3>Productos del pedido</h3>

        {detalle.length === 0 ? (
          <p>No hay productos en este pedido.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalle.map((item) => (
                  <tr key={item.id}>
                    <td>{item.titulo}</td>
                    <td>{item.cantidad}</td>
                    <td>${Number(item.precio_unitario).toFixed(2)}</td>
                    <td>${Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

export default OrderDetailPage;
