import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  cedula: string;

  @IsEmail()
  email: string;

  name: string

  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;
}