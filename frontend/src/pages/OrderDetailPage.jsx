import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMyStoreOrderDetail,
  updateMyStoreOrderStatus,
} from "../services/orderService";

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

  if (loading) {
    return <p>Cargando detalle del pedido...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
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

      setMensajeEstado("Estado actualizado correctamente");
    } catch (err) {
      setError(err.message);
    } finally {
      setActualizandoEstado(false);
    }
  };

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
          <p>Telefono: {pedido.cliente_telefono}</p>
          <p>Direccion: {pedido.direccion}</p>
          <p>Notas: {pedido.notas || "Sin notas"}</p>
          <p>Estado: {pedido.estado}</p>
          <p>Total: ${pedido.total}</p>
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
          {mensajeEstado && <p>{mensajeEstado}</p>}
        </article>
      )}

      <section>
        <h3>Productos del pedido</h3>

        {detalle.length === 0 ? (
          <p>No hay productos en este pedido.</p>
        ) : (
          <div>
            {detalle.map((item) => (
              <article key={item.id}>
                <h4>{item.titulo}</h4>
                <p>Cantidad: {item.cantidad}</p>
                <p>Precio unitario: ${item.precio_unitario}</p>
                <p>Subtotal: ${item.subtotal}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default OrderDetailPage;
