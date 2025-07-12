import { EstadoDonacion } from "src/common/enums/estado-donacion.enum";

export class ResponseReporteDonacionDto {
 

  nombre: string;
  apellido: string;
  segundoApellido: string;
  cedula: string;
  correo: string;
  telefono: string;
  estadoDonacion?: EstadoDonacion;
  descripcion: string;    
  monto: number;
  fechaDonacion: Date;
  observaciones: string;
  tipoDonacion: {
     idTipo: number;
     tipoDonacion: string;
    };
}