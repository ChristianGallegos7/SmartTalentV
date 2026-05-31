class Habilidad {
  constructor({ habilidad_id, nombre, categoria }) {
    if (!nombre) throw new Error("El nombre de la habilidad es obligatorio");

    this.habilidad_id = habilidad_id;
    this.nombre = nombre;
    this.categoria = categoria;
  }
}

module.exports = Habilidad;
