import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">Página no encontrada</h2>
      <p className="notfound-message">¡Oops! Parece que te perdiste.</p>
      <Link to="/" className="notfound-button">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
