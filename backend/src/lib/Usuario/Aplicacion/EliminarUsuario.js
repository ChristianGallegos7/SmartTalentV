class EliminarUsuario {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(usuario_id) {
    if (!usuario_id) {
      throw new Error("El ID de usuario es obligatorio para eliminar");
    }
    return await this.usuarioRepository.delete(usuario_id);
  }
}

module.exports = EliminarUsuario;
