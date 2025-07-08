import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsString()
  cedula: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;
}