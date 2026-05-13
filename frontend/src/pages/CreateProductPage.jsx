import { useEffect, useState } from "react";
import {
  createProduct,
  deleteMyProduct,
  getMyStoreProducts,
  updateMyProduct,
} from "../services/productService";
import { getUserActivo } from "../services/authService";

const initialForm = {
  titulo: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoria: "",
  estado: "",
};

function CreateProductPage() {
  const [form, setForm] = useState(initialForm);
  const [imagen, setImagen] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const userActivo = getUserActivo() === "1";

  const loadProducts = async () => {
    try {
      const data = await getMyStoreProducts();
      setProducts(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      await loadProducts();
    };

    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setImagen(null);
    setSelectedProduct(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!userActivo) {
      setError("Tu cuenta está inactiva y no puede realizar esta acción.");
      return;
    }

    try {
      setSaving(true);

      if (selectedProduct) {
        await updateMyProduct(selectedProduct.id, {
          ...form,
          imagen,
        });
        setMensaje("Producto actualizado correctamente.");
      } else {
        await createProduct({
          ...form,
          imagen,
        });
        setMensaje("Producto creado correctamente.");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setForm({
      titulo: product.titulo || "",
      descripcion: product.descripcion || "",
      precio: product.precio ?? "",
      stock: product.stock ?? "",
      categoria: product.categoria || "",
      estado: product.estado || "",
    });
    setImagen(null);
    setMensaje("");
    setError("");
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este producto?",
    );

    if (!confirmed) {
      return;
    }

    setMensaje("");
    setError("");

    try {
      await deleteMyProduct(productId);
      setMensaje("Producto eliminado correctamente.");

      if (selectedProduct?.id === productId) {
        resetForm();
      }

      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <section>
      <h2>Gestión de productos</h2>

      {!userActivo && (
        <p className="message-error">
          Tu cuenta está inactiva. Un administrador debe activarla antes de que
          puedas publicar o editar productos.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Título</label>
          <input
            disabled={!userActivo || saving}
            id="titulo"
            name="titulo"
            type="text"
            value={form.titulo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            disabled={!userActivo || saving}
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="precio">Precio</label>
          <input
            disabled={!userActivo || saving}
            id="precio"
            name="precio"
            type="number"
            min="0"
            step="0.01"
            value={form.precio}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="stock">Stock</label>
          <input
            disabled={!userActivo || saving}
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="categoria">Categoría</label>
          <input
            disabled={!userActivo || saving}
            id="categoria"
            name="categoria"
            type="text"
            value={form.categoria}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="estado">Estado</label>
          <input
            disabled={!userActivo || saving}
            id="estado"
            name="estado"
            type="text"
            value={form.estado}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="imagen">
            {selectedProduct ? "Nueva imagen (opcional)" : "Imagen"}
          </label>
          <input
            disabled={!userActivo || saving}
            id="imagen"
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0] || null)}
          />
        </div>

        <button disabled={!userActivo || saving} type="submit">
          {saving
            ? "Guardando..."
            : selectedProduct
              ? "Actualizar producto"
              : "Crear producto"}
        </button>

        {selectedProduct && (
          <button
            type="button"
            className="secondary-button"
            onClick={resetForm}
            disabled={saving}
          >
            Cancelar edición
          </button>
        )}
      </form>

      {mensaje && <p className="message-success">{mensaje}</p>}
      {error && <p className="message-error">{error}</p>}

      <section className="table-section">
        <h3>Productos de tu tienda</h3>

        {products.length === 0 ? (
          <p>Aún no tienes productos registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.imagen ? (
                        <img
                          src={product.imagen}
                          alt={product.titulo}
                          className="table-thumb"
                        />
                      ) : (
                        "Sin imagen"
                      )}
                    </td>
                    <td>{product.titulo}</td>
                    <td>{product.categoria || "Sin categoría"}</td>
                    <td>{product.estado || "Sin estado"}</td>
                    <td>${Number(product.precio).toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td className="table-actions">
                      <button type="button" onClick={() => handleEdit(product)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </button>
                    </td>
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

export default CreateProductPage;
