import { Navigate } from "react-router-dom";
import { estaAutenticado, obtenerSesion } from "../api/session";

interface Props {
  rol: string;
  children: React.ReactNode;
}

export default function RutaProtegida({ rol, children }: Props) {
  if (!estaAutenticado()) return <Navigate to="/login" replace />;
  const usuario = obtenerSesion();
  if (usuario?.rol !== rol) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
