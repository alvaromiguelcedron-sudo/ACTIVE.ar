import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabase/supabaseClient";

const Ropa = () => {
  // ==========================================
  // ESTADOS
  // ==========================================

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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
  .eq("categoria", "ropa")
  .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al obtener productos:", error);
        setError("No se pudieron cargar los productos.");
        setCargando(false);
        return;
      }

      console.log("Productos obtenidos de Supabase:", data);
      console.log("IMAGENES:", data.map((producto) => producto.imagen_url));

      // ==========================================
      // ADAPTAMOS LOS DATOS DE SUPABASE
      // A LO QUE ESPERA ProductCard
      // ==========================================

      const productosAdaptados = data.map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        marca: producto.marca,
        precio: Number(producto.precio),

        // Supabase usa imagen_url
        // ProductCard usa imagen
        imagen: producto.imagen_url,

        // Por ahora no tenemos segunda imagen
        imagenHover: null,

        colores: producto.colores || [],
        talles: producto.talles || [],

        descripcion: producto["descripción"],
        categoria: producto.categoria,
        stock: producto.stock,
      }));

      setProductos(productosAdaptados);
      setCargando(false);
    };

    obtenerProductos();
  }, []);

  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
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
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-red-600">
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

        {/* ENCABEZADO */}

        <div className="text-center mb-12">
          <p className="text-blue-900 font-semibold tracking-widest">
            ACTIVE
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Ropa deportiva
          </h1>

          <p className="text-gray-600 mt-4">
            Descubrí nuestra colección de indumentaria deportiva.
          </p>
        </div>

        {/* PRODUCTOS */}

        {productos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              No hay productos cargados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {productos.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                categoria="ropa"
              />
            ))}

          </div>
        )}

      </div>
    </main>
  );
};

export default Ropa;