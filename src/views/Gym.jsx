import { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import productosGym from "../helpers/productosGym";

const Gym = () => {

  // Cambiar logo y título de la pestaña al entrar a Gym
  useEffect(() => {
    document.title = "Active Training";

    const favicon = document.querySelector("link[rel='icon']");

    if (favicon) {
      favicon.href = "/logo-active.gym.png";
    }

    // Cuando salimos de Gym, volvemos al logo principal
    return () => {
      document.title = "Active";

      if (favicon) {
        favicon.href = "/logo-active.png";
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">

      <div className="max-w-7xl mx-auto">

        {/* ENCABEZADO */}
        <div className="text-center mb-12">

          <p className="text-blue-900 font-semibold tracking-widest">
            ACTIVE TRAINING
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
            Indumentaria deportiva
          </h1>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Entrená con propósito. Descubrí nuestra colección Active Training.
          </p>

        </div>

        {/* PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {productosGym.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              categoria="gym"
            />
          ))}

        </div>

      </div>

    </main>
  );
};

export default Gym;