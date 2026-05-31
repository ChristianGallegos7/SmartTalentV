import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../api/auth";

export default function PaginaRegistro() {
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    clave: "",
    confirmarClave: "",
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  function actualizarCampo(campo: string, valor: string) {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  }

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (formulario.clave !== formulario.confirmarClave) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);
    try {
      await registrarUsuario({
        nombre: formulario.nombre,
        correo: formulario.correo,
        clave: formulario.clave,
      });
      navegar("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-10">
          <Link to="/" className="text-xl font-bold text-gray-900">
            SmartTalent
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
            Crea tu cuenta
          </h1>
          <p className="text-gray-500 text-sm">
            Registrate para postular a las mejores vacantes tech
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            required
            value={formulario.nombre}
            onChange={(e) => actualizarCampo("nombre", e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            value={formulario.correo}
            onChange={(e) => actualizarCampo("correo", e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={formulario.clave}
            onChange={(e) => actualizarCampo("clave", e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            required
            value={formulario.confirmarClave}
            onChange={(e) => actualizarCampo("confirmarClave", e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50"
          >
            {cargando ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-8">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-black font-medium hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
