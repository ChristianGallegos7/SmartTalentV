export interface Vacante {
  vacante_id: number;
  titulo: string;
  descripcion: string;
  salario_min?: number;
  salario_max?: number;
  modalidad?: "Remoto" | "Presencial" | "Híbrido";
  ubicacion?: string;
  fecha_publicacion?: string;
}
