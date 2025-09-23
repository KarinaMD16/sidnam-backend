import { Transform } from "class-transformer";
import { IsEmail, IsNumber, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  cedula: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string

  @IsString()
  apellido1: string;

  @IsString()
  apellido2: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;

  @IsNumber()
  idRol: number;
}