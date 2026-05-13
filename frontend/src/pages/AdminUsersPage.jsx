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
      fetchUsers();
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
      fetchUsers();
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
        <div className="admin-users-list">
          {users.map((user) => (
            <article key={user.id}>
              <h3>{user.nombre}</h3>
              <p>Email: {user.email}</p>
              <p>Rol: {user.rol}</p>
              <p>Estado: {user.activo ? "Activo" : "Inactivo"}</p>

              <div className="dashboard-actions">
                {!user.activo ? (
                  <button type="button" onClick={() => handleActivate(user.id)}>
                    Activar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDeactivate(user.id)}
                  >
                    Desactivar
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminUsersPage;
