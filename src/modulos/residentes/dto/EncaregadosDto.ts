import { Expose } from "class-transformer";

export class EncargadorDto{
   @Expose()
   id: number;

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