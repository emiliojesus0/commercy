import { useState } from "react";
import { createStore } from "../services/storeService";
import { getUserActivo } from "../services/authService";

function CreateStorePage() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const userActivo = getUserActivo() === "1";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!userActivo) {
      setError("Tu cuenta está inactiva y no puede realizar esta acción.");
      return;
    }

    try {
      const data = await createStore({
        nombre,
        descripcion,
      });

      setMensaje(`Tienda creada correctamente. Slug: ${data.slug}`);
      setNombre("");
      setDescripcion("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Crear tienda</h2>

      {!userActivo && (
        <p className="message-error">
          Tu cuenta está inactiva. Un administrador debe activarla antes de que
          puedas crear tu tienda.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre de la tienda</label>
          <input
            disabled={!userActivo}
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            disabled={!userActivo}
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="4"
          />
        </div>

        <button disabled={!userActivo} type="submit">
          Crear tienda
        </button>
      </form>

      {mensaje && <p className="message-success">{mensaje}</p>}
      {error && <p className="message-error">{error}</p>}
    </section>
  );
}

export default CreateStorePage;
