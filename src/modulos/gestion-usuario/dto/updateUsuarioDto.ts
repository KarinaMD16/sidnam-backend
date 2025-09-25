import { IsOptional } from "class-validator";
import { RolUsuario } from "../entities/rol.entity";

export class UpdateUsuarioDto {
  @IsOptional()
  cedula?: string;
  @IsOptional()
  email?: string;
  @IsOptional()
  name?: string;
  
  @IsOptional()
  password?: string;
  @IsOptional()
  rol?: RolUsuario;
  @IsOptional()
  apellido1?: string;
  @IsOptional()
  apellido2?: string;
}