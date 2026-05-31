import { obtenerToken } from "./session";
import type { Habilidad } from "../tipos/habilidad";

const URL_API = "http://localhost:3977";

export async function listarHabilidades(): Promise<Habilidad[]> {
  const respuesta = await fetch(`${URL_API}/api/habilidades/ver`);
  if (!respuesta.ok) throw new Error("Error al obtener habilidades");
  return respuesta.json();
}

export async function crearHabilidad(datos: { nombre: string; categoria?: string }): Promise<Habilidad> {
  const token = obtenerToken();
  const respuesta = await fetch(`${URL_API}/api/habilidades/crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(datos),
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error ?? "Error al crear tecnología");
  return data;
}

export async function actualizarHabilidad(id: number, datos: { nombre: string; categoria?: string }): Promise<Habilidad> {
  const token = obtenerToken();
  const respuesta = await fetch(`${URL_API}/api/habilidades/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(datos),
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error ?? "Error al actualizar tecnología");
  return data;
}

export async function eliminarHabilidad(id: number): Promise<void> {
  const token = obtenerToken();
  const respuesta = await fetch(`${URL_API}/api/habilidades/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) {
    const data = await respuesta.json();
    throw new Error(data.error ?? "Error al eliminar tecnología");
  }
}
