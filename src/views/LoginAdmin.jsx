import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase/supabaseClient";

const LoginAdmin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setError("");
    setCargando(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setCargando(false);

    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    if (data.user) {
      navigate("/admin");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* ENCABEZADO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">
            Active
          </h1>

          <p className="text-gray-500 mt-2">
            Iniciar sesión
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={iniciarSesion} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@gmail.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-900"
            />
          </div>

          {/* CONTRASEÑA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-900"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* INGRESAR */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        {/* REGISTRO */}
        <div className="text-center mt-6">

          <p className="text-sm text-gray-500">
            ¿No tenés una cuenta?
          </p>

          <button
            type="button"
            onClick={() => navigate("/registro")}
            className="mt-2 text-blue-900 font-semibold hover:underline"
          >
            Registrate
          </button>

        </div>

        {/* VOLVER */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full mt-5 text-gray-500 hover:text-blue-900 text-sm"
        >
          ← Volver al inicio
        </button>

      </div>
    </main>
  );
};

export default LoginAdmin;