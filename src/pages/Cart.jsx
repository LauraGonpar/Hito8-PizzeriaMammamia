import { useCart } from "../context/CartContext";
import { Button, Alert } from "react-bootstrap";
import "./Cart.css";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const API_BASE_URL = "http://localhost:5000/api";

export const Cart = () => {
  const { cartItems, addToCart, removeFromCart, total, clearCart } = useCart();
  const { token } = useContext(UserContext);

  const [purchaseStatus, setPurchaseStatus] = useState({
    message: null,
    variant: null,
    isLoading: false,
  });

  const handleCheckout = async () => {
    if (!token) return;

    setPurchaseStatus({ ...purchaseStatus, message: null, isLoading: true });

    try {
      const response = await fetch(`${API_BASE_URL}/checkouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cart: cartItems.map((item) => ({
            id: item._id || item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (response.ok || response.status === 204) {
        console.log("✅ ¡El checkout fue un éxito, voy a vaciar el carrito!");
        setPurchaseStatus({
          message:
            "🎉 ¡Compra realizada con éxito! Revisa tu email para los detalles.",
          variant: "success",
        });
        clearCart();
      } else {
        const errorData = await response.json();
        setPurchaseStatus({
          message:
            errorData.message ||
            "Error al procesar la compra. Inténtalo de nuevo.",
          variant: "danger",
        });
      }
    } finally {
      setPurchaseStatus((prev) => ({ ...prev, isLoading: false }));
    }
  };

  if (cartItems.length === 0) {
    if (purchaseStatus.variant === "success") {
      return (
        <Alert variant="success" className="text-center mt-5">
          {purchaseStatus.message}
          <p className="mt-2">🛒 Tu carrito está ahora vacío.</p>
        </Alert>
      );
    }
    return <p className="text-center mt-5">🛒 Tu carrito está vacío</p>;
  }

  return (
    <div className="cart-container dflex my-5">
      <h2 className="mb-4">🛍️ Tu carrito</h2>

      {purchaseStatus.message && purchaseStatus.variant !== "success" && (
        <Alert variant={purchaseStatus.variant} className="mb-4">
          {purchaseStatus.message}
        </Alert>
      )}

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="d-flex justify-content-between align-items-center border-bottom py-3 mb-3 w-100"
        >
          <div className="d-flex align-items-center gap-3">
            <img
              src={item.img}
              alt={item.name}
              style={{ width: "70px", height: "70px", borderRadius: "8px" }}
            />
            <div>
              <strong>{item.name}</strong>
              <p className="m-0">${item.price.toLocaleString("es-CL")}</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-success"
              size="ml"
              onClick={() => removeFromCart(item.id)}
            >
              -
            </Button>
            <span className="d-flex justify-content-center align-items-center">
              {item.quantity}
            </span>
            <Button
              variant="outline-success"
              size="ml"
              onClick={() => addToCart(item)}
            >
              +
            </Button>
          </div>
        </div>
      ))}
      <div className="text-end mt-4">
        <h4>Total: ${total.toLocaleString("es-CL")}</h4>
      </div>

      <Button
        className="btn-success"
        onClick={handleCheckout}
        disabled={!token || purchaseStatus.isLoading}
        title={!token ? "Debes iniciar sesión para pagar" : "Finalizar compra"}
      >
        {purchaseStatus.isLoading ? "Procesando pago..." : "Finalizar compra"}
      </Button>

      {!token && (
        <p className="text-danger mt-3">
          Inicia sesión para poder realizar el pago.
        </p>
      )}
    </div>
  );
};
