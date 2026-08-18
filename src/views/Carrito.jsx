import { useCarrito } from "../context/CarritoContext";

const Carrito = () => {
  const { carrito, eliminarDelCarrito, vaciarCarrito } = useCarrito();

  if (carrito.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Tu carrito está vacío
          </h1>

          <p className="mt-4 text-gray-600">
            Todavía no agregaste ningún producto.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Mi carrito 🛒
        </h1>

        <div className="space-y-4">

          {carrito.map((producto, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between"
            >

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {producto.nombre}
                </h2>

                <p className="text-gray-500 mt-1">
                  Color: {producto.colorSeleccionado}
                </p>

                <p className="text-gray-500">
                  Talle: {producto.talleSeleccionado}
                </p>

                <p className="text-gray-500">
                  Cantidad: {producto.cantidad}
                </p>

                <p className="text-xl font-bold text-blue-900 mt-3">
                  $
                  {(
                    producto.precio * producto.cantidad
                  ).toLocaleString("es-AR")}
                </p>
              </div>

              <button
                onClick={() => eliminarDelCarrito(index)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Eliminar
              </button>

            </div>
          ))}

        </div>

        <button
          onClick={vaciarCarrito}
          className="mt-8 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Vaciar carrito
        </button>

      </div>
    </main>
  );
};

export default Carrito;