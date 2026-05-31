import { obtenerToken } from "./session";

const URL_API = "http://localhost:3977";

export interface VacanteHabilidad {
  vacante_id: number;
  habilidad_id: number;
}

export async function listarVacanteHabilidades(): Promise<VacanteHabilidad[]> {
  const respuesta = await fetch(`${URL_API}/api/vacante-habilidades/ver`, { cache: "no-store" });
  if (!respuesta.ok) throw new Error("Error al obtener habilidades de vacantes");
  return respuesta.json();
}

export async function asociarHabilidadVacante(
  vacante_id: number,
  habilidad_id: number
): Promise<void> {
  const token = obtenerToken();
  const respuesta = await fetch(`${URL_API}/api/vacante-habilidades/asociar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ vacante_id, habilidad_id }),
  });
  if (!respuesta.ok) throw new Error("Error al asociar habilidad");
}
