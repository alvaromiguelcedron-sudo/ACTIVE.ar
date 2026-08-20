import { Link } from "react-router";
import { useCarrito } from "../context/CarritoContext";

const Navbar = () => {
  const { carrito } = useCarrito();

  return (
    <nav className="bg-white border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div>
          <Link to="/" className="block">

            <h1 className="text-2xl font-bold text-blue-900">
              ACTIVE
            </h1>

            <p className="text-xs text-gray-500">
              MEN'S SPORTSWEAR
            </p>

          </Link>
        </div>


        {/* MENÚ */}
        <div className="flex gap-6 items-center">

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-900 font-medium transition"
          >
            Inicio
          </Link>

          <Link
            to="/ropa"
            className="text-gray-700 hover:text-blue-900 font-medium transition"
          >
            Ropa
          </Link>

          <Link
            to="/gym"
            className="text-gray-700 hover:text-blue-900 font-medium transition"
          >
            Gym
          </Link>

          <Link
            to="/contacto"
            className="text-gray-700 hover:text-blue-900 font-medium transition"
          >
            Contacto
          </Link>


          {/* CARRITO */}
          <Link
            to="/carrito"
            className="relative flex items-center gap-2 text-gray-700 hover:text-blue-900 font-medium transition"
          >

            <span className="text-xl">
              🛒
            </span>

            <span>
              Carrito
            </span>

            {/* CANTIDAD */}
            {carrito.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-blue-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {carrito.length}
              </span>
            )}

          </Link>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;