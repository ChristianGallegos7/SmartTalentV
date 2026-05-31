import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function PaginaBienvenida() {
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function manejarClickFuera(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownAbierto(false);
      }
    }
    document.addEventListener("mousedown", manejarClickFuera);
    return () => document.removeEventListener("mousedown", manejarClickFuera);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-gray-100 px-6 py-4">
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">SmartTalent</span>

          <div className="flex items-center gap-3">
            {/* Dropdown Candidato */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownAbierto((prev) => !prev)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Candidato
                <svg
                  className={`w-4 h-4 transition-transform ${dropdownAbierto ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownAbierto && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-10">
                  <Link
                    to="/login"
                    onClick={() => setDropdownAbierto(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    onClick={() => setDropdownAbierto(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            {/* Botón Empresa */}
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all"
            >
              Empresa
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full mb-6">
          Bolsa de empleo tech
        </span>

        <h1 className="text-5xl font-bold text-gray-900 leading-tight max-w-2xl mb-6">
          Conectamos talento con las mejores oportunidades
        </h1>

        <p className="text-lg text-gray-500 max-w-xl mb-10">
          SmartTalent es la plataforma donde encontrarás vacantes tech con las
          tecnologías que dominás. Postulá en segundos, con tu CV.
        </p>

        <div className="flex gap-3">
          <Link
            to="/registro"
            className="px-6 py-3 rounded-2xl bg-black text-white font-semibold hover:bg-gray-800 transition-all"
          >
            Buscar trabajo
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
          >
            Iniciar sesión
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-gray-100 px-6 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-1">Stack tech visible</h3>
            <p className="text-sm text-gray-500">
              Cada vacante muestra las tecnologías requeridas para que postules
              solo donde encajás.
            </p>
          </div>
          <div>
            <div className="text-2xl mb-3">📄</div>
            <h3 className="font-semibold text-gray-900 mb-1">CV en un click</h3>
            <p className="text-sm text-gray-500">
              Subí tu CV en PDF al momento de postular, sin registros complicados.
            </p>
          </div>
          <div>
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-1">Proceso simple</h3>
            <p className="text-sm text-gray-500">
              Registrate, explorá las vacantes y postulá en menos de dos minutos.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 px-6 py-6 text-center">
        <p className="text-sm text-gray-400">© 2026 SmartTalent. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
