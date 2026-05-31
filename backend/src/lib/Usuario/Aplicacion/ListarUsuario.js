class ListarUsuarios {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar() {
    return await this.usuarioRepository.findAll();
  }
}

module.exports = ListarUsuarios;