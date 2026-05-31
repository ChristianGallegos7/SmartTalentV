/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUsuario } from "../../api/auth";
import { listarHabilidades } from "../../api/habilidades";
import { crearPostulacion, listarPostulaciones } from "../../api/postulaciones";
import { obtenerSesion } from "../../api/session";
import type { VacanteHabilidad } from "../../api/vacanteHabilidades";
import { listarVacanteHabilidades } from "../../api/vacanteHabilidades";
import { listarVacantes } from "../../api/vacantes";
import type { Habilidad } from "../../tipos/habilidad";
import type { Postulacion } from "../../tipos/postulacion";
import type { Vacante } from "../../tipos/vacante";

type Pestana = "vacantes" | "postulaciones" | "perfil";

const etiquetasPestanas: Record<Pestana, string> = {
  vacantes: "Vacantes",
  postulaciones: "Mis postulaciones",
  perfil: "Mi perfil",
};

export default function PanelCandidato() {
  const navegar = useNavigate();
  const usuario = obtenerSesion()!;
  const [pestana, setPestana] = useState<Pestana>("vacantes");
  const [query, setQuery] = useState<string>("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [vacanteHabilidades, setVacanteHabilidades] = useState<
    VacanteHabilidad[]
  >([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [postulando, setPostulando] = useState(false);
  const [modalVacante, setModalVacante] = useState<Vacante | null>(null);
  const [archivoCV, setArchivoCV] = useState<File | null>(null);

  useEffect(() => {
    cargarDatos();

    const intervalo = setInterval(async () => {
      try {
        const [nuevasVacantes, nuevasVH] = await Promise.all([
          listarVacantes(),
          listarVacanteHabilidades(),
        ]);
        setVacantes(nuevasVacantes);
        setVacanteHabilidades(nuevasVH);
      } catch {
        // fallo silencioso en el polling
      }
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  async function cargarDatos() {
    setCargando(true);
    setError("");
    try {
      const [listaVacantes, listaPostulaciones, listaHabilidades, listaVH] =
        await Promise.all([
          listarVacantes(),
          listarPostulaciones(),
          listarHabilidades(),
          listarVacanteHabilidades(),
        ]);
      setVacantes(listaVacantes);
      setPostulaciones(listaPostulaciones);
      setHabilidades(listaHabilidades);
      setVacanteHabilidades(listaVH);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setCargando(false);
    }
  }

  function abrirModal(vacante: Vacante) {
    setModalVacante(vacante);
    setArchivoCV(null);
    setError("");
  }

  function cerrarModal() {
    setModalVacante(null);
    setArchivoCV(null);
  }

  async function manejarPostular() {
    if (!modalVacante || !archivoCV) return;
    setPostulando(true);
    try {
      await crearPostulacion({
        usuario_id: usuario.id,
        vacante_id: modalVacante.vacante_id,
        cv: archivoCV,
      });
      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al postular");
    } finally {
      setPostulando(false);
    }
  }

  function habilidadesDeVacante(vacante_id: number): Habilidad[] {
    const ids = vacanteHabilidades
      .filter((vh) => vh.vacante_id === vacante_id)
      .map((vh) => vh.habilidad_id);
    return habilidades.filter((h) => ids.includes(h.habilidad_id));
  }

  const misPostulaciones = postulaciones.filter(
    (p) => p.usuario_id === usuario.id,
  );
  const yaPostulo = (vacanteId: number) =>
    misPostulaciones.some((p) => p.vacante_id === vacanteId);

  function esVacanteNueva(v: Vacante) {
    // Marca como nueva si tiene una fecha reciente (intenta varias propiedades conocidas)
    const raw =
      (v as any).created_at ||
      (v as any).fecha_publicacion ||
      (v as any).createdAt;
    if (!raw) return false;
    const fecha = new Date(raw);
    const ahora = new Date();
    const diff = (ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 3; // 3 días
  }

  function cerrarSesion() {
    logoutUsuario();
    navegar("/login");
  }

  return (
    <>
      <div className="w-full min-h-screen bg-gray-50 watermark-panel">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="SmartTalent" className="site-logo" />
            <h1 className="text-xl font-bold text-gray-900">SmartTalent</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-800">
              {usuario.nombre}
            </span>
            <button
              onClick={cerrarSesion}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Vacantes disponibles
              </h2>
              <p className="text-sm text-gray-500">
                {vacantes.length} vacante{vacantes.length !== 1 ? "s" : ""}{" "}
                disponible{vacantes.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full max-w-md">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar vacantes..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm shadow-sm focus:outline-none"
              />
              <button
                onClick={() => setMostrarFiltros((s) => !s)}
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm shadow-sm"
              >
                Filtros
              </button>
            </div>
          </div>
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
            {(["vacantes", "postulaciones", "perfil"] as Pestana[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setPestana(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    pestana === tab
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {etiquetasPestanas[tab]}
                </button>
              ),
            )}
          </div>

          {cargando ? (
            <p className="text-gray-400 text-center py-12">Cargando...</p>
          ) : (
            <>
              {pestana === "vacantes" && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Vacantes disponibles
                  </h2>
                  {vacantes.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      No hay vacantes disponibles
                    </p>
                  ) : (
                    <div className="grid gap-4">
                      {vacantes
                        .filter((v) => {
                          const q = query.trim().toLowerCase();
                          if (!q) return true;
                          return (
                            v.titulo.toLowerCase().includes(q) ||
                            (v.descripcion || "").toLowerCase().includes(q)
                          );
                        })
                        .map((vacante) => {
                          const skills = habilidadesDeVacante(
                            vacante.vacante_id,
                          );
                          const postulado = yaPostulo(vacante.vacante_id);
                          return (
                            <VacancyCard
                              key={vacante.vacante_id}
                              vacante={vacante}
                              skills={skills}
                              postulado={postulado}
                              nueva={esVacanteNueva(vacante)}
                              onAbrir={() => abrirModal(vacante)}
                            />
                          );
                        })}
                    </div>
                  )}
                </section>
              )}

              {pestana === "postulaciones" && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Mis postulaciones ({misPostulaciones.length})
                  </h2>
                  {misPostulaciones.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      Aún no te has postulado a ninguna vacante
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {misPostulaciones.map((p) => {
                        const vacante = vacantes.find(
                          (v) => v.vacante_id === p.vacante_id,
                        );
                        return (
                          <div
                            key={p.postulacion_id}
                            className="bg-white rounded-2xl border border-gray-100 p-5"
                          >
                            <h3 className="font-semibold text-gray-900">
                              {vacante?.titulo ?? `Vacante #${p.vacante_id}`}
                            </h3>
                            {vacante && (
                              <p className="text-sm text-gray-500 mt-1">
                                {vacante.descripcion}
                              </p>
                            )}
                            {p.match_score != null && (
                              <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                                Match: {p.match_score}%
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {pestana === "perfil" && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Mi perfil
                  </h2>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 max-w-md">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">
                        Nombre
                      </label>
                      <p className="text-gray-900 font-medium mt-1">
                        {usuario.nombre}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">
                        Correo
                      </label>
                      <p className="text-gray-900 font-medium mt-1">
                        {usuario.correo}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">
                        Rol
                      </label>
                      <p className="text-gray-900 font-medium mt-1 capitalize">
                        {usuario.rol}
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>

      {modalVacante && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Postular a vacante
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {modalVacante.titulo}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                CV en PDF <span className="text-red-400">*</span>
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setArchivoCV(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-100 file:text-gray-700 file:font-medium hover:file:bg-gray-200 cursor-pointer"
              />
              {archivoCV && (
                <p className="text-xs text-gray-400 mt-1">{archivoCV.name}</p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={cerrarModal}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={manejarPostular}
                disabled={!archivoCV || postulando}
                className="flex-1 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {postulando ? "Enviando..." : "Enviar postulación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function VacancyCard({
  vacante,
  skills,
  postulado,
  nueva,
  onAbrir,
}: {
  vacante: Vacante;
  skills: Habilidad[];
  postulado: boolean;
  nueva: boolean;
  onAbrir: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-start shadow-sm">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-green-50 text-green-600 font-bold">
            JS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{vacante.titulo}</h3>
              {nueva && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  Nuevo
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{vacante.descripcion}</p>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((h) => (
              <span
                key={h.habilidad_id}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
              >
                {h.nombre}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 ml-4 flex flex-col items-end gap-3">
        <button
          onClick={onAbrir}
          disabled={postulado}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            postulado
              ? "bg-green-50 text-green-600 cursor-default"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {postulado ? "Postulado" : "Postular"}
        </button>
      </div>
    </div>
  );
}
