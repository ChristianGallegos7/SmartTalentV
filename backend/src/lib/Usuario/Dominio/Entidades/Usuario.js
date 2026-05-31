class Usuario {
  constructor({ usuario_id, nombre, correo, clave, rol}) {


    if (!nombre) throw new Error("El nombre es obligatorio");
    if (!correo) throw new Error("El correo es obligatorio");
    
    this.usuario_id = usuario_id;
    this.nombre = nombre;
    this.correo = correo;
    this.clave = clave;
    this.rol = rol;
  }
}

module.exports = Usuario;