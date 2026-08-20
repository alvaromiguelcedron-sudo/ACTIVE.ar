import { Link } from "react-router";

const ProductCard = ({ producto, categoria = "ropa" }) => {
  if (!producto) {
    return null;
  }

  return (
    <Link
  to={`/${categoria}/${producto.id}`}
  state={{ genero: producto.genero }}
  className="group block"
>
      <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">

        {/* IMAGEN DEL PRODUCTO */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">

          {/* =========================
              ROPA
              ========================= */}

          {categoria === "ropa" && (
            <>
              {/* Imagen principal */}
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />

              {/* Imagen al pasar el mouse */}
              {producto.imagenHover && (
                <img
                  src={producto.imagenHover}
                  alt={`${producto.nombre} medidas`}
                  className="absolute inset-0 w-full h-full object-contain bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              )}
            </>
          )}


          {/* =========================
              GYM
              ========================= */}

          {categoria === "gym" && (
            <>
              {/* Imagen del producto */}
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Capa oscura */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>

              {/* VER PRODUCTO */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                <span className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center gap-2">

                  Ver producto

                  <span className="text-xl">
                    →
                  </span>

                </span>

              </div>
            </>
          )}

        </div>


        {/* INFORMACIÓN */}
        <div className="p-4">

          {/* MARCA */}
          <p className="text-sm text-gray-500">
            {producto.marca}
          </p>

          {/* NOMBRE */}
          <h2 className="text-lg font-semibold text-gray-900 mt-1">
            {producto.nombre}
          </h2>

          {/* PRECIO */}
          <p className="text-xl font-bold text-blue-900 mt-3">
            ${producto.precio.toLocaleString("es-AR")}
          </p>


          {/* COLORES */}
          {producto.colores && producto.colores.length > 0 && (
            <div className="mt-4">

              <p className="text-sm font-medium text-gray-700 mb-2">
                Colores
              </p>

              <div className="flex flex-wrap gap-2">

                {producto.colores.map((color) => (
                  <span
                    key={color}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                  >
                    {color}
                  </span>
                ))}

              </div>

            </div>
          )}


          {/* TALLES */}
          {producto.talles && producto.talles.length > 0 && (
            <div className="mt-4">

              <p className="text-sm font-medium text-gray-700 mb-2">
                Talles
              </p>

              <div className="flex flex-wrap gap-2">

                {producto.talles.map((talle) => (
                  <span
                    key={talle}
                    className="text-xs border border-gray-300 px-3 py-1 rounded-md"
                  >
                    {talle}
                  </span>
                ))}

              </div>

            </div>
          )}

        </div>

      </article>
    </Link>
  );
};

export default ProductCard;