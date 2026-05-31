const { sequelize } = require("../Infraestructura/database/Postgres.js");

// Importa todos tus modelos
const UsuarioModel = require("../lib/Usuario/Infraestructura/Orm/UsuarioModelSequelize");
const VacanteModel = require("../lib/Vacante/Infraestructura/Orm/VacanteModelSequelize");
const PostulacionModel = require("../lib/Postulacion/Infraestructura/Orm/PostulacionModelSequelize");
const HabilidadModel = require("../lib/Habilidad/Infraestructura/Orm/HabilidadModelSequelize");
const CandidatoHabilidadModel = require("../lib/CandidatoHabilidad/Infraestructura/Orm/CandidatoHabilidadModelSequelize");
const VacanteHabilidadModel = require("../lib/VacanteHabilidad/Infraestructura/Orm/VacanteHabilidadModelSequelize");

async function syncModels() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Todos los modelos sincronizados con la BD");
  } catch (error) {
    console.error("Error al sincronizar modelos:", error);
    throw error;
  }
}

module.exports = {
  UsuarioModel,
  VacanteModel,
  PostulacionModel,
  HabilidadModel,
  CandidatoHabilidadModel,
  VacanteHabilidadModel,
  syncModels
};
