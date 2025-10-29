import { Container, Card, Button } from "react-bootstrap";
import "./Profile.css";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { email, logout, profileData } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container className="container my-5 d-flex flex-column align-items-center">
      <h2 className="text-center mb-4">Perfil de Usuario</h2>

      <Card style={{ maxWidth: "600px" }} className="mx-auto shadow-lg">
        <Card.Body>
          <Card.Title className="text-primary fs-3">
            Bienvenido, {email ? email.split("@")[0] : "Usuario"}
          </Card.Title>

          <div className="mt-3">
            <p>
              <strong>Email:</strong> {email || "Cargando..."}
            </p>
            {profileData && profileData.role && (
              <p>
                <strong>Rol:</strong> {profileData.role}
              </p>
            )}
          </div>

          <hr />

          <Button
            variant="danger"
            className="w-100 mt-3"
            onClick={handleLogout}
          >
            Cerrar sesión 🔒
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};
