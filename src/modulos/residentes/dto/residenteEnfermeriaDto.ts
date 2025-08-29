import { Expose } from "class-transformer";

export class ResidneteEnfermeriaDto {

  @Expose()
  nombre: string;

  @Expose()
  apellido1: string;

  @Expose()
  apellido2: string;

  @Expose()
  cedula: string;

  @Expose()
  sexo: string;
}
