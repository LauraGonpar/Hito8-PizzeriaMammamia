import { Form } from "react-bootstrap";
import "./LoginPage.css";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  const { login, isLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const validarDatos = async (e) => {
    e.preventDefault();
    setError(null);
    setPasswordError("");

    // 1. Validaciones locales
    if (!email.trim() || !password.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Error desconocido al iniciar sesión.");
    }
  };

  return (
    <div className="login-page">
      <Form className="login-form" onSubmit={validarDatos}>
        <h4>Ingreso de usuario</h4>

        {(error || passwordError) && (
          <div className="alert alert-danger">
            <p>{error || passwordError}</p>
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn btn-dark" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Ingresar"}
        </button>
      </Form>
    </div>
  );
};
