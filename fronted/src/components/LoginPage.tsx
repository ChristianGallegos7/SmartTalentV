import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../api/auth";

export default function PaginaLogin() {
  const navegar = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const respuesta = await loginUsuario(correo, clave);
      navegar(respuesta.usuario.rol === "admin" ? "/admin" : "/candidato");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo conectar con el servidor",
      );
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
            Bienvenido de nuevo
          </h1>
          <p className="text-gray-500">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
          <div className="relative">
            <input
              type={mostrarClave ? "text" : "password"}
              placeholder="Contraseña"
              required
              value={clave}
              onChange={(e) => {
                setClave(e.target.value);
                setMostrarClave(false);
              }}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
            {clave.length > 0 && (
              <button
                type="button"
                onClick={() => setMostrarClave((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 p-2 rounded-full"
                aria-label={mostrarClave ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarClave ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 011.175-4.375M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50"
          >
            {cargando ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-8">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-black font-medium hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
