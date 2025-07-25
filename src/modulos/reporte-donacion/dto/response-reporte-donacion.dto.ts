import { EstadoSolicitudes } from "src/common/enums/estado-solicitudes.enum";

export class ResponseReporteDonacionDto {
 

  nombre: string;
  apellido: string;
  segundoApellido: string;
  cedula: string;
  correo: string;
  telefono: string;
  estadoDonacion?: EstadoSolicitudes;
  descripcion: string;    
  monto: number;
  fechaDonacion: Date;
  observaciones: string;
  tipoDonacion: {
     idTipo: number;
     tipoDonacion: string;
    };
}