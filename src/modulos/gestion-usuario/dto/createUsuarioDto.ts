import { RolUsuario } from "../entities/rol.entity";

export class CreateUserDto {
  cedula: string;
  email: string;
  name: string;
  
  password: string;
  rol: RolUsuario;
  apellido1: string;
  apellido2: string;
}