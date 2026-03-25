export interface SolicitudPendienteNotificacion {
  id: number;
  nombre: string;
  apellido1?: string;
  apellido2?: string;
  email: string;
  tipo?: 'voluntariado' | 'donacion';
}