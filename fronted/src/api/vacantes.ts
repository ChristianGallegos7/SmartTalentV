import { obtenerToken } from "./session";
import type { Vacante } from "../tipos/vacante";

export type { Vacante };

const URL_API = "http://localhost:3977";

export async function listarVacantes(): Promise<Vacante[]> {
  const respuesta = await fetch(`${URL_API}/api/vacantes/ver`, { cache: "no-store" });
  if (!respuesta.ok) throw new Error("Error al obtener vacantes");
  return respuesta.json();
}

export async function crearVacante(datos: Omit<Vacante, "vacante_id">): Promise<Vacante> {
  const token = obtenerToken();
  const respuesta = await fetch(`${URL_API}/api/vacantes/crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(datos),
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error ?? "Error al crear vacante");
  return data;
}

export async function eliminarVacante(id: number): Promise<void> {
  const token = obtenerToken();
  const respuesta = await fetch(`${URL_API}/api/vacantes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error("Error al eliminar vacante");
}
