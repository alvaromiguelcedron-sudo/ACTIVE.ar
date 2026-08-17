import { Link, useParams } from "react-router";
import { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import productos from "../helpers/productos";

const ProductoDetalle = () => {
  const { id } = useParams();

  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const { agregarAlCarrito } = useCarrito();

  const producto = productos.find(
    (producto) => producto.id === Number(id)
  );

  if (!producto) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Producto no encontrado
          </h1>

          <Link
            to="/ropa"
            className="inline-block mt-6 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            Volver a ropa
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">

      <div className="max-w-6xl mx-auto">

        {/* BOTÓN VOLVER */}
        <Link
          to="/ropa"
          className="inline-flex items-center mb-8 text-gray-600 hover:text-gray-900 transition"
        >
          ← Volver a ropa
        </Link>

        {/* PRODUCTO */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* IMAGEN */}
            <div className="bg-gray-100 min-h-[450px] flex items-center justify-center">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-full max-h-[650px] object-contain"
              />
            </div>

            {/* INFORMACIÓN */}
            <div className="p-8 md:p-12">

              {/* MARCA */}
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                {producto.marca}
              </p>

              {/* NOMBRE */}
              <h1 className="text-4xl font-bold text-gray-900 mt-2">
                {producto.nombre}
              </h1>

              {/* PRECIO */}
              <p className="text-3xl font-bold text-blue-900 mt-6">
                ${producto.precio.toLocaleString("es-AR")}
              </p>

              {/* SEPARADOR */}
              <div className="border-t border-gray-200 my-8"></div>

              {/* COLORES */}
              {producto.colores && producto.colores.length > 0 && (
                <div>

                  <h2 className="text-sm font-semibold text-gray-900 mb-3">
                    Color
                  </h2>

                  <div className="flex flex-wrap gap-3">

                    {producto.colores.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setColorSeleccionado(color)}
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

              {/* TALLES */}
              {producto.talles && producto.talles.length > 0 && (
                <div className="mt-8">

                  <h2 className="text-sm font-semibold text-gray-900 mb-3">
                    Talle
                  </h2>

                  <div className="flex flex-wrap gap-3">

                    {producto.talles.map((talle) => (
                      <button
                        key={talle}
                        type="button"
                        onClick={() => setTalleSeleccionado(talle)}
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

              {/* CANTIDAD */}
              <div className="mt-8">

                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Cantidad
                </h2>

                <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">

                  {/* RESTAR */}
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

                  {/* CANTIDAD */}
                  <span className="w-14 h-11 flex items-center justify-center border-x border-gray-300 font-semibold">
                    {cantidad}
                  </span>

                  {/* SUMAR */}
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

              {/* BOTÓN AGREGAR AL CARRITO */}
              <button
                type="button"
                onClick={() => {

                  if (!colorSeleccionado || !talleSeleccionado) {
                    alert("Seleccioná un color y un talle.");
                    return;
                  }

                  agregarAlCarrito(
                    producto,
                    colorSeleccionado,
                    talleSeleccionado
                  );

                  alert("Producto agregado al carrito.");
                }}
                className="w-full mt-10 bg-blue-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition"
              >
                Agregar al carrito
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
};

export default ProductoDetalle;