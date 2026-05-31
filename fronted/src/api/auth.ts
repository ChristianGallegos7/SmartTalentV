import { limpiarSesion } from "./session";

const URL_API = "http://localhost:3977";

export interface RespuestaLogin {
  token: string;
  usuario: { id: number; nombre: string; correo: string; rol: string };
}

export async function loginUsuario(
  correo: string,
  clave: string
): Promise<RespuestaLogin> {
  const solicitud = await fetch(`${URL_API}/api/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, clave }),
  });

  const respuesta = (await solicitud.json()) as RespuestaLogin & { error?: string };

  if (!solicitud.ok) {
    throw new Error(respuesta.error ?? "Error al iniciar sesión");
  }

  sessionStorage.setItem("token", respuesta.token);
  sessionStorage.setItem("usuario", JSON.stringify(respuesta.usuario));

  return respuesta;
}

export function logoutUsuario(): void {
  limpiarSesion();
}

export async function registrarUsuario(datos: {
  nombre: string;
  correo: string;
  clave: string;
}): Promise<void> {
  const solicitud = await fetch(`${URL_API}/api/usuarios/crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...datos, rol: "candidato" }),
  });
  const respuesta = await solicitud.json();
  if (!solicitud.ok) {
    throw new Error(respuesta.error ?? "Error al registrarse");
  }
}
