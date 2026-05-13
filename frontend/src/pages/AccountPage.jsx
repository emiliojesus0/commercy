import { useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyPassword,
  updateMyProfile,
} from "../services/authService";
import { getMyStore, updateMyStore } from "../services/storeService";

function AccountPage() {
  const [profileForm, setProfileForm] = useState({
    nombre: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [storeForm, setStoreForm] = useState({
    nombre: "",
    descripcion: "",
    color_fondo: "#f8fafc",
  });
  const [storeLogoPreview, setStoreLogoPreview] = useState("");
  const [storeLogoFile, setStoreLogoFile] = useState(null);
  const [hasStore, setHasStore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await getMyProfile();
        setProfileForm({
          nombre: profile.nombre || "",
          email: profile.email || "",
        });

        try {
          const store = await getMyStore();
          setStoreForm({
            nombre: store.nombre || "",
            descripcion: store.descripcion || "",
            color_fondo: store.color_fondo || "#f8fafc",
          });
          setStoreLogoPreview(store.logo || "");
          setHasStore(true);
        } catch {
          setHasStore(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await updateMyProfile({ nombre: profileForm.nombre });
      setMessage("Cuenta actualizada correctamente.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await updateMyPassword(passwordForm);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });
      setMessage("Contraseña actualizada correctamente.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStoreSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = await updateMyStore({
        ...storeForm,
        logo: storeLogoFile,
      });
      setMessage(`Tienda actualizada correctamente. Nuevo slug: ${data.slug}`);

      if (storeLogoFile) {
        const refreshedStore = await getMyStore();
        setStoreLogoPreview(refreshedStore.logo || "");
        setStoreLogoFile(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Cargando cuenta...</p>;
  }

  return (
    <section>
      <h2>Mi cuenta</h2>

      {message && <p className="message-success">{message}</p>}
      {error && <p className="message-error">{error}</p>}

      <div className="account-grid">
        <form onSubmit={handleProfileSubmit}>
          <h3>Datos de la cuenta</h3>

          <div>
            <label htmlFor="profile-nombre">Nombre</label>
            <input
              id="profile-nombre"
              type="text"
              value={profileForm.nombre}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  nombre: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              value={profileForm.email}
              disabled
            />
          </div>

          <button type="submit">Guardar cuenta</button>
        </form>

        <form onSubmit={handlePasswordSubmit}>
          <h3>Cambiar contraseña</h3>

          <div>
            <label htmlFor="currentPassword">Contraseña actual</label>
            <input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="newPassword">Nueva contraseña</label>
            <input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />
          </div>

          <button type="submit">Actualizar contraseña</button>
        </form>
      </div>

      {hasStore ? (
        <form onSubmit={handleStoreSubmit}>
          <h3>Diseño y datos de la tienda</h3>

          <div>
            <label htmlFor="store-nombre">Nombre de la tienda</label>
            <input
              id="store-nombre"
              type="text"
              value={storeForm.nombre}
              onChange={(e) =>
                setStoreForm((prev) => ({
                  ...prev,
                  nombre: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="store-descripcion">Descripción</label>
            <textarea
              id="store-descripcion"
              rows="4"
              value={storeForm.descripcion}
              onChange={(e) =>
                setStoreForm((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="store-color">Color de fondo</label>
            <input
              id="store-color"
              type="color"
              value={storeForm.color_fondo}
              onChange={(e) =>
                setStoreForm((prev) => ({
                  ...prev,
                  color_fondo: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label htmlFor="store-logo">Logo de la tienda</label>
            <input
              id="store-logo"
              type="file"
              accept="image/*"
              onChange={(e) => setStoreLogoFile(e.target.files[0] || null)}
            />
          </div>

          {storeLogoPreview && (
            <div>
              <p>Logo actual</p>
              <img
                src={storeLogoPreview}
                alt="Logo de la tienda"
                className="store-logo-preview"
              />
            </div>
          )}

          <button type="submit">Guardar tienda</button>
        </form>
      ) : (
        <article>
          <h3>Tienda</h3>
          <p>Todavía no tienes una tienda creada para editar.</p>
        </article>
      )}
    </section>
  );
}

export default AccountPage;
