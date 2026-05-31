import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUsuario } from "../../api/auth";
import { actualizarHabilidad, crearHabilidad, eliminarHabilidad, listarHabilidades } from "../../api/habilidades";
import { analizarMatch, listarPostulaciones } from "../../api/postulaciones";
import { obtenerSesion } from "../../api/session";
import type { VacanteHabilidad } from "../../api/vacanteHabilidades";
import {
  asociarHabilidadVacante,
  listarVacanteHabilidades,
} from "../../api/vacanteHabilidades";
import {
  crearVacante,
  eliminarVacante,
  listarVacantes,
} from "../../api/vacantes";
import type { Habilidad } from "../../tipos/habilidad";
import type { Postulacion } from "../../tipos/postulacion";
import type { Vacante } from "../../tipos/vacante";

type Pestana = "vacantes" | "postulaciones" | "tecnologias";

type GrupoVacante = {
  vacante_id: number;
  titulo: string;
  postulaciones: import("../../tipos/postulacion").Postulacion[];
};

export default function PanelAdmin() {
  const navegar = useNavigate();
  const usuario = obtenerSesion()!;
  const [pestana, setPestana] = useState<Pestana>("vacantes");
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [vacanteHabilidades, setVacanteHabilidades] = useState<
    VacanteHabilidad[]
  >([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [formulario, setFormulario] = useState({ titulo: "", descripcion: "" });
  const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState<
    number[]
  >([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [creando, setCreando] = useState(false);
  const [vacantesExpandidas, setVacantesExpandidas] = useState<Set<number>>(new Set());
  const [analizando, setAnalizando] = useState<Set<number>>(new Set());

  // Estado CRUD tecnologías
  const [formTec, setFormTec] = useState({ nombre: "", categoria: "" });
  const [guardandoTec, setGuardandoTec] = useState(false);
  const [editandoTec, setEditandoTec] = useState<Habilidad | null>(null);

  useEffect(() => {
    cargarDatos();
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

  async function manejarCrearVacante(e: React.FormEvent) {
    e.preventDefault();
    setCreando(true);
    try {
      const nuevaVacante = await crearVacante({
        titulo: formulario.titulo,
        descripcion: formulario.descripcion,
      });
      await Promise.all(
        habilidadesSeleccionadas.map((habilidad_id) =>
          asociarHabilidadVacante(nuevaVacante.vacante_id, habilidad_id),
        ),
      );
      setFormulario({ titulo: "", descripcion: "" });
      setHabilidadesSeleccionadas([]);
      setMostrarFormulario(false);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear vacante");
    } finally {
      setCreando(false);
    }
  }

  async function manejarEliminarVacante(id: number) {
    if (!confirm("¿Eliminar esta vacante?")) return;
    try {
      await eliminarVacante(id);
      setVacantes((prev) => prev.filter((v) => v.vacante_id !== id));
      setVacanteHabilidades((prev) =>
        prev.filter((vh) => vh.vacante_id !== id),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar vacante",
      );
    }
  }

  function toggleHabilidad(id: number) {
    setHabilidadesSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id],
    );
  }

  function habilidadesDeVacante(vacante_id: number): Habilidad[] {
    const ids = vacanteHabilidades
      .filter((vh) => vh.vacante_id === vacante_id)
      .map((vh) => vh.habilidad_id);
    return habilidades.filter((h) => ids.includes(h.habilidad_id));
  }

  async function manejarAnalizarMatch(postulacion_id: number) {
    setAnalizando((prev) => new Set(prev).add(postulacion_id));
    try {
      const resultado = await analizarMatch(postulacion_id);
      setPostulaciones((prev) =>
        prev.map((p) =>
          p.postulacion_id === postulacion_id
            ? { ...p, match_score: resultado.match_score }
            : p,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al analizar");
    } finally {
      setAnalizando((prev) => {
        const next = new Set(prev);
        next.delete(postulacion_id);
        return next;
      });
    }
  }

  async function manejarGuardarTec(e: React.FormEvent) {
    e.preventDefault();
    setGuardandoTec(true);
    try {
      if (editandoTec) {
        const actualizada = await actualizarHabilidad(editandoTec.habilidad_id, formTec);
        setHabilidades((prev) => prev.map((h) => h.habilidad_id === actualizada.habilidad_id ? actualizada : h));
        setEditandoTec(null);
      } else {
        const nueva = await crearHabilidad(formTec);
        setHabilidades((prev) => [...prev, nueva]);
      }
      setFormTec({ nombre: "", categoria: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar tecnología");
    } finally {
      setGuardandoTec(false);
    }
  }

  async function manejarEliminarTec(id: number) {
    if (!confirm("¿Eliminar esta tecnología?")) return;
    try {
      await eliminarHabilidad(id);
      setHabilidades((prev) => prev.filter((h) => h.habilidad_id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar tecnología");
    }
  }

  function iniciarEdicionTec(h: Habilidad) {
    setEditandoTec(h);
    setFormTec({ nombre: h.nombre, categoria: h.categoria ?? "" });
  }

  function cancelarEdicionTec() {
    setEditandoTec(null);
    setFormTec({ nombre: "", categoria: "" });
  }

  function cerrarSesion() {
    logoutUsuario();
    navegar("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 watermark-panel">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="SmartTalent" className="site-logo" />
          <h1 className="text-xl font-bold text-gray-900">SmartTalent</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Admin:{" "}
            <span className="font-medium text-gray-800">{usuario.nombre}</span>
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
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
          {(["vacantes", "postulaciones", "tecnologias"] as Pestana[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setPestana(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                pestana === tab
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {{ vacantes: "Vacantes", postulaciones: "Postulaciones", tecnologias: "Tecnologías" }[tab]}
            </button>
          ))}
        </div>

        {cargando ? (
          <p className="text-gray-400 text-center py-12">Cargando...</p>
        ) : (
          <>
            {pestana === "vacantes" && (
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Vacantes ({vacantes.length})
                  </h2>
                  <button
                    onClick={() => {
                      setMostrarFormulario(!mostrarFormulario);
                      setHabilidadesSeleccionadas([]);
                    }}
                    className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
                  >
                    {mostrarFormulario ? "Cancelar" : "+ Nueva vacante"}
                  </button>
                </div>

                {mostrarFormulario && (
                  <form
                    onSubmit={manejarCrearVacante}
                    className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 space-y-4"
                  >
                    <h3 className="font-semibold text-gray-800">
                      Nueva vacante
                    </h3>
                    <input
                      type="text"
                      placeholder="Título"
                      required
                      value={formulario.titulo}
                      onChange={(e) =>
                        setFormulario((prev) => ({
                          ...prev,
                          titulo: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Descripción"
                      required
                      value={formulario.descripcion}
                      onChange={(e) =>
                        setFormulario((prev) => ({
                          ...prev,
                          descripcion: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Tecnologías requeridas
                      </p>
                      {habilidades.length === 0 ? (
                        <p className="text-sm text-gray-400">
                          No hay habilidades registradas aún.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {habilidades.map((h) => {
                            const seleccionada =
                              habilidadesSeleccionadas.includes(h.habilidad_id);
                            return (
                              <button
                                key={h.habilidad_id}
                                type="button"
                                onClick={() => toggleHabilidad(h.habilidad_id)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  seleccionada
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                {h.nombre}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={creando}
                      className="bg-black text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                    >
                      {creando ? "Creando..." : "Crear vacante"}
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {vacantes.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      No hay vacantes registradas
                    </p>
                  ) : (
                    vacantes.map((vacante) => {
                      const skills = habilidadesDeVacante(vacante.vacante_id);
                      return (
                        <div
                          key={vacante.vacante_id}
                          className="bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {vacante.titulo}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {vacante.descripcion}
                            </p>
                            {skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3">
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
                          <button
                            onClick={() =>
                              manejarEliminarVacante(vacante.vacante_id)
                            }
                            className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors shrink-0 ml-4"
                          >
                            Eliminar
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            )}

            {pestana === "postulaciones" && (
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Postulaciones ({postulaciones.length})
                </h2>
                {postulaciones.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No hay postulaciones registradas
                  </p>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      const grupos = postulaciones.reduce<GrupoVacante[]>((acc, p) => {
                        const existente = acc.find(g => g.vacante_id === p.vacante_id);
                        if (existente) {
                          existente.postulaciones.push(p);
                        } else {
                          acc.push({
                            vacante_id: p.vacante_id,
                            titulo: p.vacante_titulo ?? `Vacante #${p.vacante_id}`,
                            postulaciones: [p],
                          });
                        }
                        return acc;
                      }, []);

                      return grupos.map((grupo) => {
                        const expandido = vacantesExpandidas.has(grupo.vacante_id);
                        return (
                          <div
                            key={grupo.vacante_id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                          >
                            <button
                              onClick={() =>
                                setVacantesExpandidas((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(grupo.vacante_id)) {
                                    next.delete(grupo.vacante_id);
                                  } else {
                                    next.add(grupo.vacante_id);
                                  }
                                  return next;
                                })
                              }
                              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-gray-900">
                                  {grupo.titulo}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                                  {grupo.postulaciones.length} candidato{grupo.postulaciones.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <span className="text-gray-400 text-sm">
                                {expandido ? "▲" : "▼"}
                              </span>
                            </button>

                            {expandido && (
                              <div className="border-t border-gray-100">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="text-left px-5 py-2.5 font-medium text-gray-400 text-xs">Candidato</th>
                                      <th className="text-left px-5 py-2.5 font-medium text-gray-400 text-xs">Correo</th>
                                      <th className="text-left px-5 py-2.5 font-medium text-gray-400 text-xs">Match</th>
                                      <th className="text-left px-5 py-2.5 font-medium text-gray-400 text-xs">CV</th>
                                      <th className="px-5 py-2.5"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {grupo.postulaciones.map((p) => {
                                      const estaAnalizando = analizando.has(p.postulacion_id);
                                      return (
                                        <tr
                                          key={p.postulacion_id}
                                          className="border-t border-gray-50"
                                        >
                                          <td className="px-5 py-3 font-medium text-gray-800">
                                            {p.candidato_nombre ?? `Usuario #${p.usuario_id}`}
                                          </td>
                                          <td className="px-5 py-3 text-gray-400 text-xs">
                                            {p.candidato_correo ?? "—"}
                                          </td>
                                          <td className="px-5 py-3">
                                            {p.match_score != null ? (
                                              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg font-medium text-xs ${
                                                p.match_score >= 70
                                                  ? "bg-green-50 text-green-700"
                                                  : p.match_score >= 40
                                                  ? "bg-yellow-50 text-yellow-700"
                                                  : "bg-red-50 text-red-600"
                                              }`}>
                                                {p.match_score}%
                                              </span>
                                            ) : (
                                              <span className="text-gray-300">—</span>
                                            )}
                                          </td>
                                          <td className="px-5 py-3">
                                            {p.resume_url ? (
                                              <a
                                                href={p.resume_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 font-medium text-xs"
                                              >
                                                Ver CV
                                              </a>
                                            ) : (
                                              <span className="text-gray-300">—</span>
                                            )}
                                          </td>
                                          <td className="px-5 py-3 text-right">
                                            <button
                                              onClick={() => manejarAnalizarMatch(p.postulacion_id)}
                                              disabled={estaAnalizando}
                                              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                              {estaAnalizando ? "Analizando..." : "Analizar"}
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </section>
            )}

            {pestana === "tecnologias" && (
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Tecnologías ({habilidades.length})
                </h2>

                {/* Formulario crear / editar */}
                <form
                  onSubmit={manejarGuardarTec}
                  className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex flex-wrap gap-3 items-end"
                >
                  <div className="flex-1 min-w-40">
                    <label className="text-xs font-medium text-gray-500 block mb-1">Nombre *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: React, Python, AWS..."
                      value={formTec.nombre}
                      onChange={(e) => setFormTec((p) => ({ ...p, nombre: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1 min-w-40">
                    <label className="text-xs font-medium text-gray-500 block mb-1">Categoría</label>
                    <input
                      type="text"
                      placeholder="Ej: Frontend, Backend, Cloud..."
                      value={formTec.categoria}
                      onChange={(e) => setFormTec((p) => ({ ...p, categoria: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={guardandoTec}
                      className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-all"
                    >
                      {guardandoTec ? "Guardando..." : editandoTec ? "Guardar cambios" : "+ Agregar"}
                    </button>
                    {editandoTec && (
                      <button
                        type="button"
                        onClick={cancelarEdicionTec}
                        className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                {/* Lista */}
                {habilidades.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No hay tecnologías registradas</p>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left px-5 py-3 font-medium text-gray-500">Nombre</th>
                          <th className="text-left px-5 py-3 font-medium text-gray-500">Categoría</th>
                          <th className="px-5 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {habilidades.map((h) => (
                          <tr key={h.habilidad_id} className="border-b border-gray-50 last:border-0">
                            <td className="px-5 py-3 font-medium text-gray-800">{h.nombre}</td>
                            <td className="px-5 py-3">
                              {h.categoria ? (
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                                  {h.categoria}
                                </span>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                            <td className="px-5 py-3 text-right flex justify-end gap-3">
                              <button
                                onClick={() => iniciarEdicionTec(h)}
                                className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => manejarEliminarTec(h.habilidad_id)}
                                className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
