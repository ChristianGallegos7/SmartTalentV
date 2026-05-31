const express = require("express");
const cors = require("cors");
const path = require("path");

// Importa todos los módulos
const registerUserModule = require("./lib/Usuario/Infraestructura/http");
const registerVacanteModule = require("./lib/Vacante/Infraestructura/http");
const registerPostulacionModule = require("./lib/Postulacion/Infraestructura/http");
const registerHabilidadModule = require("./lib/Habilidad/Infraestructura/http");
const registerCandidatoHabilidadModule = require("./lib/CandidatoHabilidad/Infraestructura/http");
const registerVacanteHabilidadModule = require("./lib/VacanteHabilidad/Infraestructura/http");

function buildApp() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  // Módulos
  registerUserModule(app);
  registerVacanteModule(app);
  registerPostulacionModule(app);
  registerHabilidadModule(app);
  registerCandidatoHabilidadModule(app);
  registerVacanteHabilidadModule(app);

  // 404
  app.use((req, res) => res.status(404).json({ message: "Ruta no encontrada" }));

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
      message: err.message || "Error interno del servidor",
    });
  });

  return app;
}

module.exports = buildApp;
