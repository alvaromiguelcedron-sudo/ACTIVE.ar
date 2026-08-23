import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabase/supabaseClient";

const Gym = () => {
  // ==========================================
  // UBICACIÓN
  // ==========================================

  const location = useLocation();

  // Recuperamos el género si venimos desde un producto
  const generoAnterior = location.state?.genero;

  // ==========================================
  // ESTADOS
  // ==========================================

  const [generoSeleccionado, setGeneroSeleccionado] = useState(
    generoAnterior || "hombre"
  );

  const [productos, setProductos] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // CAMBIAR LOGO Y TÍTULO
  // ==========================================

  useEffect(() => {
    document.title = "Active Training";

    const favicon = document.querySelector("link[rel='icon']");

    if (favicon) {
      favicon.href = "/logo-active.gym.png";
    }

    // Cuando salimos de Gym
    return () => {
      document.title = "Active";

      if (favicon) {
        favicon.href = "/logo-active.png";
      }
    };
  }, []);

  // ==========================================
  // OBTENER PRODUCTOS DE SUPABASE
  // ==========================================

  useEffect(() => {
    const obtenerProductos = async () => {
      setCargando(true);
      setError("");

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("categoria", "gym")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al obtener productos de Gym:", error);

        setError("No se pudieron cargar los productos de Gym.");

        setCargando(false);

        return;
      }

      console.log("Productos de Gym obtenidos de Supabase:", data);

      // ==========================================
      // ADAPTAMOS LOS PRODUCTOS
      // ==========================================

      const productosAdaptados = data.map((producto) => ({
        id: producto.id,

        nombre: producto.nombre,

        marca: producto.marca,

        precio: Number(producto.precio),

        // Supabase
        imagen_url: producto.imagen_url,

        // ProductCard también puede utilizar imagen
        imagen: producto.imagen_url,

        colores: Array.isArray(producto.colores)
          ? producto.colores
          : [],

        talles: Array.isArray(producto.talles)
          ? producto.talles
          : [],

        genero: producto.genero,

        categoria: producto.categoria,

        descripcion: producto["descripción"],

        stock: producto.stock,
      }));

      setProductos(productosAdaptados);

      setCargando(false);
    };

    obtenerProductos();
  }, []);

  // ==========================================
  // FILTRAR POR GÉNERO
  // ==========================================

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.genero === generoSeleccionado
  );

  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <p className="text-xl text-gray-600">
          Cargando productos...
        </p>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <p className="text-xl text-red-600 text-center">
          {error}
        </p>
      </main>
    );
  }

  // ==========================================
  // PÁGINA
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">

      <div className="max-w-7xl mx-auto">

        {/* ======================================
            ENCABEZADO
        ====================================== */}

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

        {/* ======================================
            BOTONES MUJER / HOMBRE
        ====================================== */}

        <div className="flex flex-wrap justify-center gap-4 mb-12">

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

        {/* ======================================
            PRODUCTOS
        ====================================== */}

        {productosFiltrados.length === 0 ? (

          <div className="text-center py-20">

            <p className="text-xl text-gray-500">
              No hay productos disponibles.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {productosFiltrados.map((producto) => (

              <ProductCard
                key={producto.id}
                producto={producto}
                categoria="gym"
              />

            ))}

          </div>

        )}

      </div>

    </main>
  );
};

export default Gym;