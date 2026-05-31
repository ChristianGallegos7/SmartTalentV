class Vacante {
  constructor({ vacante_id, titulo, descripcion, salario_min, salario_max, modalidad, ubicacion, fecha_publicacion }) {
    if (!titulo) throw new Error("El título es obligatorio");
    if (!descripcion) throw new Error("La descripción es obligatoria");

    this.vacante_id = vacante_id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.salario_min = salario_min ?? null;
    this.salario_max = salario_max ?? null;
    this.modalidad = modalidad ?? null;
    this.ubicacion = ubicacion ?? null;
    this.fecha_publicacion = fecha_publicacion ?? null;
  }
}

module.exports = Vacante;
