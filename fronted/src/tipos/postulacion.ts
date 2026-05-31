export interface Postulacion {
  postulacion_id: number;
  usuario_id: number;
  vacante_id: number;
  resume_url?: string;
  match_score?: number;
  candidato_nombre?: string;
  candidato_correo?: string;
  vacante_titulo?: string;
}
