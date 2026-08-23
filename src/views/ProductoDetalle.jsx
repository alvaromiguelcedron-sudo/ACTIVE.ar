import { Link, useParams, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useCarrito } from "../context/CarritoContext";

const ProductoDetalle = () => {
  const { id } = useParams();
  const location = useLocation();

  // Detectamos si el producto pertenece a Ropa o Gym
  const categoria = location.pathname.startsWith("/gym")
    ? "gym"
    : "ropa";

  // Detectamos el género
  const genero = location.state?.genero || null;

  // Estados
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // Carrito
  const { agregarAlCarrito } = useCarrito();

  // ==========================================
  // BUSCAR PRODUCTO EN SUPABASE
  // ==========================================

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        setCargando(true);

        console.log("Buscando producto con ID:", id);

        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("ERROR AL BUSCAR PRODUCTO:", error);
          setProducto(null);
          return;
        }

        console.log("PRODUCTO ENCONTRADO EN SUPABASE:", data);

        // Adaptamos los nombres de Supabase
        const productoAdaptado = {
          ...data,

          // Supabase usa imagen_url
          imagen: data.imagen_url,

          // La columna de Supabase se llama "descripción"
          descripcion: data.descripción,

          // Aseguramos que sean arrays
          colores: Array.isArray(data.colores)
            ? data.colores
            : [],

          talles: Array.isArray(data.talles)
            ? data.talles
            : [],

          // En Supabase stock corresponde a existencias
          existencias: data.stock,
        };

        setProducto(productoAdaptado);
      } catch (error) {
        console.error("ERROR INESPERADO:", error);
        setProducto(null);
      } finally {
        setCargando(false);
      }
    };

    obtenerProducto();
  }, [id]);

  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">
          Cargando producto...
        </p>
      </main>
    );
  }

  // ==========================================
  // PRODUCTO NO ENCONTRADO
  // ==========================================

  if (!producto) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            Producto no encontrado
          </h1>

          <p className="text-gray-600 mt-3">
            No pudimos encontrar este producto en la base de datos.
          </p>

          <Link
            to={categoria === "gym" ? "/gym" : "/ropa"}
            className="inline-block mt-6 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            Volver
          </Link>

        </div>
      </main>
    );
  }

  // ==========================================
  // AGREGAR AL CARRITO
  // ==========================================

  const manejarAgregarAlCarrito = () => {
    if (producto.talles?.length > 0 && !talleSeleccionado) {
      alert("Seleccioná un talle.");
      return;
    }

    if (producto.colores?.length > 0 && !colorSeleccionado) {
      alert("Seleccioná un color.");
      return;
    }

    agregarAlCarrito(
      producto,
      colorSeleccionado,
      talleSeleccionado,
      cantidad
    );

    alert("Producto agregado al carrito 🛒");
  };

  // ==========================================
  // WHATSAPP
  // ==========================================

  const consultarPorWhatsApp = () => {
    if (producto.talles?.length > 0 && !talleSeleccionado) {
      alert("Seleccioná un talle.");
      return;
    }

    if (producto.colores?.length > 0 && !colorSeleccionado) {
      alert("Seleccioná un color.");
      return;
    }

    const subtotal = Number(producto.precio) * cantidad;

    const mensaje = `👋 Hola, quiero consultar por este producto.

🛍️ Producto: ${producto.nombre}

🏷️ Marca: ${producto.marca}

🎨 Color: ${colorSeleccionado || "No corresponde"}

📏 Talle: ${talleSeleccionado || "No corresponde"}

📦 Cantidad: ${cantidad}

💰 Precio unitario: $${Number(producto.precio).toLocaleString("es-AR")}

💵 Total: $${subtotal.toLocaleString("es-AR")}`;

    const url = `https://wa.me/543813341115?text=${encodeURIComponent(
      mensaje
    )}`;

    window.open(url, "_blank");
  };

  // ==========================================
  // RUTA PARA VOLVER
  // ==========================================

  const rutaVolver =
    categoria === "gym" ? "/gym" : "/ropa";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">

      <div className="max-w-6xl mx-auto">

        {/* VOLVER */}

        <Link
          to={rutaVolver}
          state={
            categoria === "gym"
              ? { genero: genero || "hombre" }
              : undefined
          }
          className="inline-flex items-center mb-8 text-gray-600 hover:text-gray-900 transition"
        >
          ← Volver
        </Link>

        {/* PRODUCTO */}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* ==============================
                IMAGEN
            ============================== */}

            <div className="bg-white w-full h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
  {producto.imagen ? (
    <img
      src={producto.imagen}
      alt={producto.nombre}
      className="w-full h-full object-contain"
    />
  ) : (
    <div className="text-gray-400">
      Sin imagen
    </div>
  )}
</div>
            {/* ==============================
                INFORMACIÓN
            ============================== */}

            <div className="p-8 md:p-12">

              {/* MARCA */}

              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                {producto.marca}
              </p>

              {/* GÉNERO */}

              {categoria === "gym" && (
                <p className="text-sm font-semibold text-blue-900 uppercase tracking-widest mt-3">
                  {genero === "mujer" ? "Mujer" : "Hombre"}
                </p>
              )}

              {/* NOMBRE */}

              <h1 className="text-4xl font-bold text-gray-900 mt-2">
                {producto.nombre}
              </h1>

              {/* PRECIO */}

              <p className="text-3xl font-bold text-blue-900 mt-6">
                ${Number(producto.precio).toLocaleString("es-AR")}
              </p>

              {/* DESCRIPCIÓN */}

              {producto.descripcion && (
                <p className="text-gray-600 mt-6 leading-relaxed">
                  {producto.descripcion}
                </p>
              )}

              {/* SEPARADOR */}

              <div className="border-t border-gray-200 my-8"></div>

              {/* ==============================
                  COLORES
              ============================== */}

              {producto.colores &&
                producto.colores.length > 0 && (

                  <div>

                    <h2 className="text-sm font-semibold text-gray-900 mb-3">
                      Color
                    </h2>

                    <div className="flex flex-wrap gap-3">

                      {producto.colores.map((color) => (

                        <button
                          key={color}
                          type="button"
                          onClick={() =>
                            setColorSeleccionado(color)
                          }
                          className={`px-5 py-2 rounded-lg border transition ${
                            colorSeleccionado === color
                              ? "border-blue-900 bg-blue-900 text-white"
                              : "border-gray-300 hover:border-blue-900 hover:bg-gray-50"
                          }`}
                        >
                          {color}
                        </button>

                      ))}

                    </div>

                  </div>
                )}

              {/* ==============================
                  TALLES
              ============================== */}

              {producto.talles &&
                producto.talles.length > 0 && (

                  <div className="mt-8">

                    <h2 className="text-sm font-semibold text-gray-900 mb-3">
                      Talle
                    </h2>

                    <div className="flex flex-wrap gap-3">

                      {producto.talles.map((talle) => (

                        <button
                          key={talle}
                          type="button"
                          onClick={() =>
                            setTalleSeleccionado(talle)
                          }
                          className={`px-5 py-2 rounded-lg border transition ${
                            talleSeleccionado === talle
                              ? "border-blue-900 bg-blue-900 text-white"
                              : "border-gray-300 hover:border-blue-900 hover:bg-gray-50"
                          }`}
                        >
                          {talle}
                        </button>

                      ))}

                    </div>

                  </div>
                )}

              {/* ==============================
                  CANTIDAD
              ============================== */}

              <div className="mt-8">

                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Cantidad
                </h2>

                <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">

                  <button
                    type="button"
                    onClick={() =>
                      setCantidad((cantidadActual) =>
                        Math.max(1, cantidadActual - 1)
                      )
                    }
                    className="w-12 h-11 flex items-center justify-center text-xl font-semibold hover:bg-gray-100 transition"
                  >
                    −
                  </button>

                  <span className="w-14 h-11 flex items-center justify-center border-x border-gray-300 font-semibold">
                    {cantidad}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCantidad((cantidadActual) =>
                        cantidadActual + 1
                      )
                    }
                    className="w-12 h-11 flex items-center justify-center text-xl font-semibold hover:bg-gray-100 transition"
                  >
                    +
                  </button>

                </div>

              </div>

              {/* ==============================
                  CARRITO
              ============================== */}

              <button
                type="button"
                onClick={manejarAgregarAlCarrito}
                className="w-full mt-10 bg-blue-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition"
              >
                🛒 Agregar al carrito
              </button>

              {/* ==============================
                  WHATSAPP
              ============================== */}

              <button
                type="button"
                onClick={consultarPorWhatsApp}
                className="w-full mt-4 bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition"
              >
                Consultar por WhatsApp
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
};

export default ProductoDetalle;