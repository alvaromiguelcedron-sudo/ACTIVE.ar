import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useCarrito } from "../context/CarritoContext";
import { supabase } from "../supabase/supabaseClient";

const Navbar = () => {
  const { carrito } = useCarrito();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  // ==========================================
  // VERIFICAR SESIÓN
  // ==========================================

  useEffect(() => {
    const obtenerSesion = async () => {
      const { data } = await supabase.auth.getSession();

      setUsuario(data.session?.user || null);
    };

    obtenerSesion();

    // Escuchar cambios en la sesión
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUsuario(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const cerrarSesion = async () => {
    await supabase.auth.signOut();

    setUsuario(null);

    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">

        {/* =====================================
            LOGO
        ====================================== */}

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

        {/* =====================================
            MENÚ
        ====================================== */}

        <div className="flex gap-4 md:gap-6 items-center flex-wrap justify-end">

          {/* INICIO */}

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-900 font-medium transition"
          >
            Inicio
          </Link>

          {/* ROPA */}

          <Link
            to="/ropa"
            className="text-gray-700 hover:text-blue-900 font-medium transition"
          >
            Ropa
          </Link>

          {/* GYM */}

          <Link
            to="/gym"
            className="text-gray-700 hover:text-blue-900 font-medium transition"
          >
            Gym
          </Link>

          {/* CONTACTO */}

          <Link
            to="/contacto"
            className="text-gray-700 hover:text-blue-900 font-medium transition"
          >
            Contacto
          </Link>

          {/* =====================================
              CARRITO
          ====================================== */}

          <Link
            to="/carrito"
            className="relative flex items-center gap-2 text-gray-700 hover:text-blue-900 font-medium transition"
          >
            <span className="text-xl">
              🛒
            </span>

            <span className="hidden sm:inline">
              Carrito
            </span>

            {carrito.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-blue-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {carrito.length}
              </span>
            )}
          </Link>

          {/* =====================================
              USUARIO NO LOGUEADO
          ====================================== */}

          {!usuario && (
            <Link
              to="/login-admin"
              className="text-gray-700 hover:text-blue-900 font-medium transition"
            >
              Iniciar sesión
            </Link>
          )}

          {/* =====================================
              USUARIO LOGUEADO
          ====================================== */}

          {usuario && (
            <>
              {/* BOTÓN ADMINISTRADOR */}

              <Link
                to="/admin"
                className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Administrador
              </Link>

              {/* CERRAR SESIÓN */}

              <button
                type="button"
                onClick={cerrarSesion}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Cerrar sesión
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;