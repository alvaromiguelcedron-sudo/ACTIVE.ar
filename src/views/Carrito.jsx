import { useCarrito } from "../context/CarritoContext";

const Carrito = () => {
  const {
    carrito,
    eliminarDelCarrito,
    vaciarCarrito,
    aumentarCantidad,
    disminuirCantidad,
  } = useCarrito();

  // Calcular total
  const totalCarrito = carrito.reduce(
    (total, producto) =>
      total + producto.precio * producto.cantidad,
    0
  );

  // ==============================
  // WHATSAPP
  // ==============================
  const consultarPedidoPorWhatsApp = () => {
    if (carrito.length === 0) {
      return;
    }

    let mensaje = `👋 Hola, quiero consultar por este pedido:\n\n`;

    carrito.forEach((producto, index) => {
      const subtotal =
        producto.precio * producto.cantidad;

      mensaje += `🛍️ Producto ${index + 1}

${producto.nombre}

🏷️ Marca: ${producto.marca}

🎨 Color: ${producto.colorSeleccionado}

📏 Talle: ${producto.talleSeleccionado}

📦 Cantidad: ${producto.cantidad}

💰 Subtotal: $${subtotal.toLocaleString("es-AR")}

`;
    });

    mensaje += `────────────────────

💵 TOTAL: $${totalCarrito.toLocaleString("es-AR")}`;

    const url = `https://wa.me/543815301844?text=${encodeURIComponent(
      mensaje
    )}`;

    window.open(url, "_blank");
  };

  // ==============================
  // CARRITO VACÍO
  // ==============================
  if (carrito.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-sm p-12">

            <div className="text-6xl mb-6">
              🛒
            </div>

            <h1 className="text-4xl font-bold text-gray-900">
              Tu carrito está vacío
            </h1>

            <p className="mt-4 text-gray-600">
              Todavía no agregaste ningún producto.
            </p>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ==============================
            ENCABEZADO
        ============================== */}

        <div className="mb-8">

          <p className="text-blue-900 font-semibold tracking-widest">
            ACTIVEE
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Mi carrito 🛒
          </h1>

          <p className="text-gray-600 mt-2">
            Revisá tus productos antes de realizar la consulta.
          </p>

        </div>

        {/* ==============================
            PRODUCTOS
        ============================== */}

        <div className="space-y-4">

          {carrito.map((producto, index) => (

            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-6"
            >

              {/* ==============================
                  IMAGEN
              ============================== */}

              <div className="w-full md:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">

                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />

              </div>

              {/* ==============================
                  INFORMACIÓN
              ============================== */}

              <div className="flex-1">

                {/* MARCA */}

                <p className="text-sm text-gray-500">
                  {producto.marca}
                </p>

                {/* NOMBRE */}

                <h2 className="text-xl font-semibold text-gray-900 mt-1">
                  {producto.nombre}
                </h2>

                {/* DESCRIPCIÓN */}

                <div className="mt-3 space-y-2 text-gray-600">

                  <p>
                    🎨 Color:{" "}
                    <span className="font-medium text-gray-900">
                      {producto.colorSeleccionado}
                    </span>
                  </p>

                  <p>
                    📏 Talle:{" "}
                    <span className="font-medium text-gray-900">
                      {producto.talleSeleccionado}
                    </span>
                  </p>

                  {/* ==============================
                      CANTIDAD
                  ============================== */}

                  <div className="flex items-center gap-3 mt-3">

                    <span>
                      📦 Cantidad:
                    </span>

                    {/* RESTAR */}

                    <button
                      type="button"
                      onClick={() => disminuirCantidad(index)}
                      className="w-8 h-8 bg-white border border-gray-300 rounded-lg text-gray-900 font-bold hover:bg-gray-100 transition"
                    >
                      −
                    </button>

                    {/* CANTIDAD */}

                    <span className="font-bold text-gray-900 min-w-[30px] text-center">
                      {producto.cantidad}
                    </span>

                    {/* SUMAR */}

                    <button
                      type="button"
                      onClick={() => aumentarCantidad(index)}
                      className="w-8 h-8 bg-white border border-gray-300 rounded-lg text-gray-900 font-bold hover:bg-gray-100 transition"
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* ==============================
                    PRECIO
                ============================== */}

                <p className="text-xl font-bold text-blue-900 mt-4">
                  $
                  {(
                    producto.precio *
                    producto.cantidad
                  ).toLocaleString("es-AR")}
                </p>

              </div>

              {/* ==============================
                  ELIMINAR
              ============================== */}

              <div className="flex items-end md:items-center">

                <button
                  type="button"
                  onClick={() => eliminarDelCarrito(index)}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Eliminar
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* ==============================
            RESUMEN
        ============================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">

          <div className="flex items-center justify-between">

            <span className="text-lg text-gray-600">
              Total del pedido
            </span>

            <span className="text-3xl font-bold text-blue-900">
              ${totalCarrito.toLocaleString("es-AR")}
            </span>

          </div>

          {/* ==============================
              BOTONES
          ============================== */}

          <div className="flex flex-col sm:flex-row gap-4 mt-6">

            {/* VACIAR */}

            <button
              type="button"
              onClick={vaciarCarrito}
              className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Vaciar carrito
            </button>

            {/* WHATSAPP */}

            <button
              type="button"
              onClick={consultarPedidoPorWhatsApp}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Consultar pedido por WhatsApp
            </button>

          </div>

        </div>

      </div>
    </main>
  );
};

export default Carrito;