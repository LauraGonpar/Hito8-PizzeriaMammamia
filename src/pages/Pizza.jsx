import { useState, useEffect } from "react";
import { Container, Card, ListGroup, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import "./Pizza.css";
import { useParams } from "react-router-dom";

const API_URL = `http://localhost:5000/api/pizzas`;

export const Pizza = () => {
  const { id } = useParams();
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const FINAL_URL = `${API_URL}/${id}`;
    const fetchPizzaDetail = async () => {
      try {
        const response = await fetch(FINAL_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPizza(data);
      } catch (err) {
        setError(
          `Error al cargar la pizza con ID ${id}. Detalle: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPizzaDetail();
    } else {
      setError("Error: No se encontró la ID de la pizza en la URL.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        Cargando detalles de la pizza... 🍕
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-5">
        Error: Error al cargar la pizza.
      </div>
    );
  }

  if (!pizza) {
    return <div className="text-center mt-5">Pizza no encontrada.</div>;
  }

  const { name, price, ingredients, img, desc } = pizza;

  return (
    <Container className="container my-5">
      <Card className="Card shadow-lg p-0" style={{ maxWidth: "400px" }}>
        <Card.Img src={img} alt={name} />
        <Card.Body>
          <Card.Title className="text-capitalize mb-3 border-bottom pb-2">
            {name}
          </Card.Title>
          <Card.Text className="text-secondary mb-4">{desc}</Card.Text>

          <Card.Text className="d-flex justify-content-start fw-bold m-0 text-dark">
            Ingredientes:
          </Card.Text>
          <ListGroup className="text-capitalize mb-4">
            <ListGroup.Item>
              <ul
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  padding: 0,
                  margin: 0,
                  gap: "8px",
                }}
              >
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="badge bg-light text-dark p-2">
                    🍕 {ingredient}
                  </li>
                ))}
              </ul>
            </ListGroup.Item>
          </ListGroup>

          <Card.Text className="d-flex justify-content-start mb-3">
            <strong>Precio: ${price.toLocaleString("es-CL")}</strong>
          </Card.Text>

          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              className="border-dark"
              onClick={() => addToCart(pizza)}
            >
              Añadir 🛒
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
