import { Link } from "react-router";

const ProductCard = ({ producto }) => {
  if (!producto) {
    return null;
  }

  return (
    <Link
      to={`/ropa/${producto.id}`}
      className="group block"
    >
      <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">

        {/* IMAGEN DEL PRODUCTO */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">

  {/* Imagen principal */}
  <img
    src={producto.imagen}
    alt={producto.nombre}
    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
  />

  {/* Imagen al pasar el mouse */}
  <img
    src={producto.imagenHover}
    alt={`${producto.nombre} medidas`}
    className="absolute inset-0 w-full h-full object-contain bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
  />

</div>

        {/* INFORMACIÓN */}
        <div className="p-4">

          <p className="text-sm text-gray-500">
            {producto.marca}
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-1">
            {producto.nombre}
          </h2>

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