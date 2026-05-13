import { useCart } from "../context/CartContext";
import { useState } from "react";
import { createOrder } from "../services/orderService";
import { Link } from "react-router-dom";

function CartPage() {
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart } =
    useCart();
  const currentStoreSlug = cartItems.length > 0 ? cartItems[0].storeSlug : null;

  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const total = cartItems.reduce((acc, item) => {
    return acc + Number(item.precio) * item.cantidad;
  }, 0);

  const handleDecrease = (item) => {
    if (item.cantidad <= 1) {
      removeFromCart(item.id);
      return;
    }

    updateCartItemQuantity(item.id, item.cantidad - 1);
  };

  const handleIncrease = (item) => {
    updateCartItemQuantity(item.id, item.cantidad + 1);
  };

  const handleSubmitOrder = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (cartItems.length === 0) {
      setError("Tu carrito esta vacio");
      return;
    }

    const storeSlug = cartItems[0].storeSlug;

    const productos = cartItems.map((item) => ({
      producto_id: item.id,
      cantidad: item.cantidad,
    }));

    try {
      const data = await createOrder(storeSlug, {
        cliente_nombre: clienteNombre,
        cliente_email: clienteEmail,
        cliente_telefono: clienteTelefono,
        direccion,
        notas,
        productos,
      });

      setMensaje(data.message || "Pedido creado correctamente");
      setClienteNombre("");
      setClienteEmail("");
      setClienteTelefono("");
      setDireccion("");
      setNotas("");
      clearCart();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Carrito</h2>
      {currentStoreSlug && (
        <p>
          <Link to={`/store/${currentStoreSlug}`}>
            Seguir comprando en esta tienda
          </Link>
        </p>
      )}

      {cartItems.length === 0 ? (
        <p>Tu carrito esta vacio.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => {
              const imageUrl = item.imagen
                ? `${import.meta.env.VITE_API_URL.replace("/api", "")}/uploads/products/${item.imagen}`
                : null;

              return (
                <article key={item.id} className="cart-item">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.titulo}
                      className="cart-item-image"
                    />
                  ) : (
                    <div className="cart-item-image cart-item-placeholder">
                      Sin imagen
                    </div>
                  )}

                  <div className="cart-item-content">
                    <h3>{item.titulo}</h3>
                    <p>Precio: ${item.precio}</p>
                    <p>
                      Subtotal: $
                      {(Number(item.precio) * item.cantidad).toFixed(2)}
                    </p>

                    <div className="cart-controls">
                      <button
                        type="button"
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Total del carrito</h3>
            <p>
              <strong>${total.toFixed(2)}</strong>
            </p>
          </div>
          <form onSubmit={handleSubmitOrder} className="order-form-section">
            <div>
              <label htmlFor="clienteNombre">Nombre</label>
              <input
                id="clienteNombre"
                type="text"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="clienteEmail">Email</label>
              <input
                id="clienteEmail"
                type="email"
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="clienteTelefono">Telefono</label>
              <input
                id="clienteTelefono"
                type="text"
                value={clienteTelefono}
                onChange={(e) => setClienteTelefono(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="direccion">Direccion</label>
              <textarea
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                rows="3"
              />
            </div>

            <div>
              <label htmlFor="notas">Notas</label>
              <textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows="3"
              />
            </div>

            <button type="submit">Confirmar pedido</button>
          </form>
          {mensaje && <p className="message-success">{mensaje}</p>}
          {error && <p className="message-error">{error}</p>}
        </>
      )}
    </section>
  );
}

export default CartPage;
