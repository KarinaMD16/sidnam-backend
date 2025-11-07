import { IsEmail, IsOptional, MaxLength } from 'class-validator';

export class UpdateProveedorDto {

  @IsOptional()
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  nombre?: string;

  @IsOptional()
  numero?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  direccion?: string;

}
