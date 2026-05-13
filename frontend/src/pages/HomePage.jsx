import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section>
      <h1>Commercy</h1>
      <p>Marketplace para emprendedores.</p>
      <p>
        Los clientes pueden recorrer tiendas, descubrir productos y realizar
        pedidos desde una experiencia simple.
      </p>
      <p>
        Los vendedores pueden crear su cuenta, administrar su tienda, publicar
        productos y gestionar pedidos desde su panel.
      </p>

      <div className="dashboard-actions">
        <Link to="/register" className="dashboard-link">
          Quiero vender
        </Link>
        <Link to="/login" className="dashboard-link">
          Ingresar al panel
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
