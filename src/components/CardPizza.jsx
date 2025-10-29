import { Card, ListGroup, Button } from "react-bootstrap";
import "./CardPizza.css";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CardPizza({ pizza }) {
  const { addToCart } = useCart();

  const { desc, name, price, ingredients, img } = pizza;

  return (
    <div>
      <Card style={{ width: "18rem", height: "35rem" }} className="Card">
        <Card.Img variant="top" src={img} alt={desc} />
        <Card.Body>
          <Card.Title style={{ textTransform: "capitalize" }}>
            {name}
          </Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush text-center text-capitalize h-25">
          <Card.Text className="d-flex justify-content-center fw-bold m-2 text-dark">
            Ingredientes:
          </Card.Text>
          <ListGroup.Item>
            <ul
              style={{
                display: "flex",
                flexWrap: "wrap",
                listStyleType: "none",
                padding: 0,
                margin: 10,
                justifyContent: "center",
              }}
            >
              {ingredients.map((ingredient, index) => (
                <li key={index}>🍕{ingredient}</li>
              ))}
            </ul>
          </ListGroup.Item>
        </ListGroup>
        <Card.Text className="d-flex justify-content-center mt-2 mb-2">
          <strong>Precio: $</strong>
          {typeof price === "number" ? price.toFixed(0) : price}
        </Card.Text>
        <Card.Body className="d-flex justify-content-center gap-2 ">
          <Link to={`/pizza/${pizza.id}`}>
            <Button variant="dark" className="border-dark">
              Ver mas 👀
            </Button>
          </Link>
          <Link>
            <Button
              variant="success"
              className="border-dark"
              onClick={() => {
                console.log("Producto enviado a addToCart:", pizza);
                addToCart(pizza);
              }}
            >
              Añadir 🛒
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
}
