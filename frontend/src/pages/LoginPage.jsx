import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    try {
      const data = await loginUser({ email, password });

      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split(".")[1]));

      localStorage.setItem("userRole", payload.rol);
      localStorage.setItem("userActivo", payload.activo);

      setMensaje("Login exitoso");
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Ingresar</button>
      </form>

      {mensaje && <p className="message-success">{mensaje}</p>}
      {error && <p className="message-error">{error}</p>}
    </section>
  );
}

export default LoginPage;
