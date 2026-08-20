import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ProductCard from "../components/ProductCard";
import productosGym from "../helpers/productosGym";

const Gym = () => {

  // Detectamos si venimos desde un producto
  const location = useLocation();

  // Recuperamos Mujer o Hombre desde el producto
  const generoAnterior = location.state?.genero;

  // Género seleccionado
  const [generoSeleccionado, setGeneroSeleccionado] = useState(
    generoAnterior || "hombre"
  );

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

  // Filtrar productos según Mujer / Hombre
  const productosFiltrados = productosGym.filter(
    (producto) => producto.genero === generoSeleccionado
  );

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">

      <div className="max-w-7xl mx-auto">

        {/* =========================
            ENCABEZADO
        ========================== */}

        <div className="text-center mb-10">

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


        {/* =========================
            BOTONES MUJER / HOMBRE
        ========================== */}

        <div className="flex justify-center gap-4 mb-12">

          {/* MUJER */}

          <button
            type="button"
            onClick={() => setGeneroSeleccionado("mujer")}
            className={`px-8 py-3 rounded-lg font-semibold border transition ${
              generoSeleccionado === "mujer"
                ? "bg-blue-900 text-white border-blue-900"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-900"
            }`}
          >
            MUJER
          </button>


          {/* HOMBRE */}

          <button
            type="button"
            onClick={() => setGeneroSeleccionado("hombre")}
            className={`px-8 py-3 rounded-lg font-semibold border transition ${
              generoSeleccionado === "hombre"
                ? "bg-blue-900 text-white border-blue-900"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-900"
            }`}
          >
            HOMBRE
          </button>

        </div>


        {/* =========================
            PRODUCTOS
        ========================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {productosFiltrados.map((producto) => (

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