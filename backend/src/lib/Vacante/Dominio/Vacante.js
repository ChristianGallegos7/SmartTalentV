class Vacante {
  constructor({ vacante_id, titulo, descripcion }) {
    if (!titulo) throw new Error("El título es obligatorio");
    if (!descripcion) throw new Error("La descripción es obligatoria");

    this.vacante_id = vacante_id;
    this.titulo = titulo;
    this.descripcion = descripcion;
  }
}

module.exports = Vacante;
