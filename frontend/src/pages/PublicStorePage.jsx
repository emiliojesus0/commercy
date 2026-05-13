import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStoreBySlug } from "../services/storeService";
import { getStoreProducts } from "../services/productService";
import { useCart } from "../context/CartContext";

function PublicStorePage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [cartFeedback, setCartFeedback] = useState({
    productId: null,
    type: "",
    message: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeData = await getStoreBySlug(slug);
        const productsData = await getStoreProducts(slug);

        setStore(storeData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [slug]);

  if (loading) {
    return <p>Cargando tienda...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const filteredProducts = products.filter((product) => {
    const titulo = product.titulo?.toLowerCase() || "";
    const descripcion = product.descripcion?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    return titulo.includes(term) || descripcion.includes(term);
  });

  return (
    <section>
      {store && (
        <header>
          <h2>{store.nombre}</h2>
          <p>{store.descripcion}</p>
          <div className="search-box">
            <label htmlFor="search">Buscar productos</label>
            <input
              id="search"
              type="text"
              placeholder="Ej. cuaderno, taza, collar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>
      )}

      <section>
        <h3>Productos</h3>

        {filteredProducts.length === 0 ? (
          <p>No se encontraron productos para esta búsqueda.</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const imageUrl = product.imagen || null;

              return (
                <article key={product.id} className="product-card">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.titulo}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image product-image-placeholder">
                      Sin imagen
                    </div>
                  )}

                  <h4>{product.titulo}</h4>
                  <p>{product.descripcion || "Sin descripción"}</p>
                  <p>
                    <strong>${product.precio}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const error = addToCart({
                        ...product,
                        storeSlug: slug,
                      });

                      if (error) {
                        setCartFeedback({
                          productId: product.id,
                          type: "error",
                          message: error,
                        });
                      } else {
                        setCartFeedback({
                          productId: product.id,
                          type: "success",
                          message: "Producto agregado al carrito",
                        });
                      }
                    }}
                  >
                    Agregar al carrito
                  </button>

                  {cartFeedback.productId === product.id &&
                    cartFeedback.type === "success" && (
                      <p className="message-success">{cartFeedback.message}</p>
                    )}

                  {cartFeedback.productId === product.id &&
                    cartFeedback.type === "error" && (
                      <p className="message-error">{cartFeedback.message}</p>
                    )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

export default PublicStorePage;
