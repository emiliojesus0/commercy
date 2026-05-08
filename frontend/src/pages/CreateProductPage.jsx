import { useState } from "react";
import { createProduct } from "../services/productService";
import { getUserActivo } from "../services/authService";

function CreateProductPage() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estado, setEstado] = useState("");
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const userActivo = getUserActivo() === "1";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");
    if (!userActivo) {
      setError("Tu cuenta esta inactiva y no puede realizar esta accion");
      return;
    }

    try {
      const data = await createProduct({
        titulo,
        descripcion,
        precio,
        stock,
        categoria,
        estado,
        imagen,
      });

      setMensaje(`Producto creado correctamente. ID: ${data.id}`);
      setTitulo("");
      setDescripcion("");
      setPrecio("");
      setStock("");
      setCategoria("");
      setEstado("");
      setImagen(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Crear producto</h2>
      {!userActivo && (
        <p className="message-error">
          Tu cuenta esta inactiva. Un administrador debe activarla antes de que
          puedas publicar productos.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Titulo</label>
          <input
            disabled={!userActivo}
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="descripcion">Descripcion</label>
          <textarea
            disabled={!userActivo}
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="precio">Precio</label>
          <input
            disabled={!userActivo}
            id="precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="stock">Stock</label>
          <input
            disabled={!userActivo}
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="categoria">Categoria</label>
          <input
            disabled={!userActivo}
            id="categoria"
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="estado">Estado</label>
          <input
            disabled={!userActivo}
            id="estado"
            type="text"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="imagen">Imagen</label>
          <input
            disabled={!userActivo}
            id="imagen"
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />
        </div>

        <button disabled={!userActivo} type="submit">
          Crear producto
        </button>
      </form>

      {mensaje && <p className="message-success">{mensaje}</p>}
      {error && <p className="message-error">{error}</p>}
    </section>
  );
}

export default CreateProductPage;
