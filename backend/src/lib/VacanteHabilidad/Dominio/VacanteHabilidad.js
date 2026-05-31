class VacanteHabilidad {
  constructor({ vacante_id, habilidad_id }) {
    if (!vacante_id) throw new Error("El vacante_id es obligatorio");
    if (!habilidad_id) throw new Error("El habilidad_id es obligatorio");
    this.vacante_id = vacante_id;
    this.habilidad_id = habilidad_id;
  }
}

module.exports = VacanteHabilidad;
