import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PaginaBienvenida from "./components/PaginaBienvenida";
import PaginaLogin from "./components/LoginPage";
import PaginaRegistro from "./components/PaginaRegistro";
import PanelAdmin from "./components/admin/PanelAdmin";
import PanelCandidato from "./components/candidato/PanelCandidato";
import RutaProtegida from "./components/RutaProtegida";

export default function Aplicacion() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaBienvenida />} />
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/registro" element={<PaginaRegistro />} />
        <Route
          path="/admin"
          element={
            <RutaProtegida rol="admin">
              <PanelAdmin />
            </RutaProtegida>
          }
        />
        <Route
          path="/candidato"
          element={
            <RutaProtegida rol="candidato">
              <PanelCandidato />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
