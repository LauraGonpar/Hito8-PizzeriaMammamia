import { useState, useEffect } from "react";
import Header from "../components/Header";
import CardPizza from "../components/CardPizza";
// import { pizzas } from "../pizzas";

export default function Home() {
  const [pizzas, setPizzas] = useState([]);
  const API_URL = "http://localhost:5000/api/pizzas";

  useEffect(() => {
    const getPizzas = async () => {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPizzas(data);
    };

    getPizzas();
  }, []);

  return (
    <div>
      <Header />
      <div className="container my-3 p-4">
        <div className="d-flex flex-wrap justify-content-center gap-4 bg-light p-4 ">
          {pizzas.map((p) => (
            <CardPizza
              key={p.id}
              pizza={{
                id: p.id,
                price: p.price,
                name: p.name,
                desc: p.desc,
                img: p.img,
                ingredients: p.ingredients,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
