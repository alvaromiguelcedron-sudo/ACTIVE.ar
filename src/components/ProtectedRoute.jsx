import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const ProtectedRoute = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const { data } = await supabase.auth.getSession();

      setUsuario(data.session?.user || null);
      setCargando(false);
    };

    verificarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUsuario(session?.user || null);
      setCargando(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Mientras comprobamos la sesión
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Verificando acceso...
        </p>
      </div>
    );
  }

  // Si no está logueado, vuelve al login
  if (!usuario) {
    return <Navigate to="/login-admin" replace />;
  }

  // Si está logueado, permite entrar
  return children;
};

export default ProtectedRoute;