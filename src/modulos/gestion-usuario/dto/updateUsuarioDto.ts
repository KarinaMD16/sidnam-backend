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
  apellido1?: string;
  @IsOptional()
  apellido2?: string;
}