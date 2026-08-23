import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase/supabaseClient";

const Registro = () => {
  const navigate = useNavigate();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const registrarUsuario = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    // Validar contraseñas
    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Validar longitud
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,

      options: {
        data: {
          nombre_completo: nombreCompleto.trim(),
          nombre_usuario: nombreUsuario.trim(),
          fecha_nacimiento: fechaNacimiento,
        },
      },
    });

    setCargando(false);

    if (error) {
      console.error("ERROR SUPABASE:", error);

      setError(error.message);

      return;
    }

    console.log("Usuario registrado:", data);

    setMensaje(
      "Cuenta creada correctamente. Revisá tu correo electrónico para confirmar la cuenta."
    );
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
            Crear una cuenta
          </p>

          <p className="text-gray-400 text-sm mt-2">
            Completá tus datos para registrarte
          </p>
        </div>

        {/* FORMULARIO */}

        <form onSubmit={registrarUsuario} className="space-y-5">

          {/* NOMBRE COMPLETO */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>

            <input
              type="text"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              placeholder="Ej: Juan Pérez"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-900"
            />
          </div>

          {/* NOMBRE DE USUARIO */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de usuario
            </label>

            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              placeholder="Ej: juanperez"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-900"
            />
          </div>

          {/* CORREO */}

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

          {/* FECHA DE NACIMIENTO */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de nacimiento
            </label>

            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
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
              placeholder="Mínimo 6 caracteres"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-900"
            />
          </div>

          {/* CONFIRMAR CONTRASEÑA */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
            </label>

            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="Repetí tu contraseña"
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

          {/* MENSAJE */}

          {mensaje && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm">
              {mensaje}
            </div>
          )}

          {/* BOTÓN */}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* IR AL LOGIN */}

        <button
          type="button"
          onClick={() => navigate("/login-admin")}
          className="w-full mt-4 text-gray-500 hover:text-blue-900 text-sm"
        >
          ← Ya tengo una cuenta
        </button>

        {/* VOLVER */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full mt-3 text-gray-500 hover:text-blue-900 text-sm"
        >
          ← Volver al inicio
        </button>

      </div>
    </main>
  );
};

export default Registro;