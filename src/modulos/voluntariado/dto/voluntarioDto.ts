import { Expose } from "class-transformer";

export class VoluntarioDto {
  @Expose()
  cedula: string;

  @Expose()
  nombre: string;

  @Expose()
  apellido1: string;

  @Expose()
  apellido2: string;
}