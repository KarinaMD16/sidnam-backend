import { isNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ActualizarEncargadorDto{


   @IsOptional()
   @IsNumber()
   id?: number;

   @IsOptional()
   nombre?: string;


   cedula: string;

   @IsOptional()
   apellido1?: string;

   @IsOptional()
   apellido2?: string;

   @IsOptional()
   telefono?: string;

   @IsOptional()
   correo?: string;

}