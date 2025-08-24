import { Expose } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class EncargadorDto{

   @Expose()
   id: number;

   @Expose()
   cedula: string;

   @Expose()
   nombre: string;

   @Expose()
   apellido1: string;

   @Expose()
   apellido2: string;

   @Expose()
   telefono: string;

   @Expose()
   correo: string;
 
}