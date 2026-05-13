import { useEffect, useState } from "react";
import {
  activateUser,
  deactivateUser,
  getAdminUsers,
} from "../services/adminService";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, []);

  const handleActivate = async (userId) => {
    setError("");
    setMessage("");

    try {
      const data = await activateUser(userId);
      setMessage(data.message);
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeactivate = async (userId) => {
    setError("");
    setMessage("");

    try {
      const data = await deactivateUser(userId);
      setMessage(data.message);
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Cargando vendedores...</p>;
  }

  return (
    <section>
      <h2>Gestión de vendedores</h2>

      {message && <p className="message-success">{message}</p>}
      {error && <p className="message-error">{error}</p>}

      {users.length === 0 ? (
        <p>No hay vendedores registrados.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Tienda</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>{user.rol}</td>
                  <td>{user.tienda_nombre || "Sin tienda"}</td>
                  <td>{user.activo ? "Activo" : "Inactivo"}</td>
                  <td className="table-actions">
                    {!user.activo ? (
                      <button
                        type="button"
                        onClick={() => handleActivate(user.id)}
                      >
                        Activar
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDeactivate(user.id)}
                      >
                        Desactivar
                      </button>
                    )}
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

export default AdminUsersPage;
