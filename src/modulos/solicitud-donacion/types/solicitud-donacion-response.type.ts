import { Solicitud_donacion_pendiente } from '../entities/solicitudDonacionPendiente.entity';

export type SolicitudDonacionPendienteResponse =
  Omit<Solicitud_donacion_pendiente, 'creadoEn'> & {
    creadoEn: string;
  };