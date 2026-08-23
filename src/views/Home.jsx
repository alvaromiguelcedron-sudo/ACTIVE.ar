import { useEffect, useState } from "react";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabase/supabaseClient";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // OBTENER PRODUCTOS DESDE SUPABASE
  // ==========================================

  useEffect(() => {
    const obtenerProductos = async () => {
      setCargando(true);

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id", { ascending: true });

      console.log("PRODUCTOS DESDE SUPABASE:", data);
      console.log("ERROR:", error);

      if (error) {
        console.error("Error obteniendo productos:", error);
        setError(error.message);
        setCargando(false);
        return;
      }

      // Adaptamos los datos de Supabase
      // para que funcionen con nuestro ProductCard
      const productosAdaptados = (data || []).map((producto) => ({
        ...producto,

        // Supabase tiene imagen_url
        // y nuestro componente puede usar imagen
        imagen: producto.imagen_url,

        // Dejamos también imagen_url disponible
        imagen_url: producto.imagen_url,
      }));

      setProductos(productosAdaptados);
      setCargando(false);
    };

    obtenerProductos();
  }, []);

  // ==========================================
  // PRODUCTOS DESTACADOS
  // ==========================================

  const productosDestacados = productos.slice(0, 3);

  return (
    <main className="bg-gray-100 min-h-screen">

      {/* ==========================================
          HERO / PRESENTACIÓN
      ========================================== */}

      <section className="text-center py-20 px-4">

        <p className="text-blue-900 font-semibold tracking-widest">
          ACTIVE | MEN'S SPORTSWEAR
        </p>

        <h1 className="text-5xl font-bold text-gray-900 mt-4">
          ACTIVE
        </h1>

        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Indumentaria deportiva y urbana para hombre.
        </p>

        <Link
          to="/ropa"
          className="inline-block mt-8 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
        >
          Ver productos
        </Link>

      </section>

      {/* ==========================================
          PRODUCTOS DESTACADOS
      ========================================== */}

      <section className="max-w-7xl mx-auto px-4 py-16">

        <div className="text-center mb-10">

          <p className="text-blue-900 font-semibold tracking-widest">
            ACTIVE
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Productos destacados
          </h2>

          <p className="text-gray-600 mt-3">
            Conocé algunos de nuestros productos.
          </p>

        </div>

        {/* ==========================================
            CARGANDO
        ========================================== */}

        {cargando && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">
              Cargando productos...
            </p>
          </div>
        )}

        {/* ==========================================
            ERROR
        ========================================== */}

        {!cargando && error && (
          <div className="text-center py-10">
            <p className="text-red-600 font-semibold">
              No se pudieron cargar los productos.
            </p>

            <p className="text-gray-500 mt-2">
              {error}
            </p>
          </div>
        )}

        {/* ==========================================
            PRODUCTOS
        ========================================== */}

        {!cargando && !error && productosDestacados.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {productosDestacados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
              />
            ))}

          </div>
        )}

        {/* ==========================================
            SI NO HAY PRODUCTOS
        ========================================== */}

        {!cargando && !error && productosDestacados.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">
              No hay productos cargados todavía.
            </p>
          </div>
        )}

        <div className="text-center mt-10">

          <Link
            to="/ropa"
            className="inline-block border border-blue-900 text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-900 hover:text-white transition"
          >
            Ver toda la ropa
          </Link>

        </div>

      </section>

      {/* ==========================================
          SECCIÓN GYM
      ========================================== */}

      <section className="bg-white py-16 px-4 text-center">

        <p className="text-blue-900 font-semibold tracking-widest">
          ACTIVE GYM
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          Preparado para entrenar
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto mt-4">
          Descubrí nuestra colección deportiva para acompañarte
          en cada entrenamiento.
        </p>

        <Link
          to="/gym"
          className="inline-block mt-8 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
        >
          Ver colección Gym
        </Link>

      </section>

      {/* ==========================================
          WHATSAPP
      ========================================== */}

      <section className="bg-gray-900 text-white py-16 px-4 text-center">

        <h2 className="text-3xl font-bold">
          ¿Tenés alguna consulta?
        </h2>

        <p className="text-gray-300 mt-3">
          Estamos para ayudarte con tu compra.
        </p>

        <a
          href="https://wa.me/543813341115"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Consultar por WhatsApp
        </a>

      </section>

    </main>
  );
};

export default Home;