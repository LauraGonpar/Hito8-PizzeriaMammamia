import { useState, useContext } from "react";
import { Form } from "react-bootstrap";
import "./RegisterPage.css";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  const { register, isLoading } = useContext(UserContext);

  const navigate = useNavigate();

  const validarDatos = async (e) => {
    e.preventDefault();
    setError(null);
    setPasswordError("");

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    const result = await register(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Error desconocido al registrar usuario.");
    }
  };

  return (
    <div className="register-page">
      <Form className="register-form" onSubmit={validarDatos}>
        <h4>Registro de usuario</h4>

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
        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            name="Confirmar contraseña"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            value={confirmPassword}
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="btn btn-dark" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Registrarse"}
        </button>
      </Form>
    </div>
  );
};
