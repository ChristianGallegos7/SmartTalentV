export interface UsuarioSesion {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export function obtenerToken(): string | null {
  return sessionStorage.getItem("token");
}

export function obtenerSesion(): UsuarioSesion | null {
  const datos = sessionStorage.getItem("usuario");
  if (!datos) return null;
  try {
    return JSON.parse(datos) as UsuarioSesion;
  } catch {
    return null;
  }
}

export function estaAutenticado(): boolean {
  return obtenerToken() !== null && obtenerSesion() !== null;
}

export function limpiarSesion(): void {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuario");
}
