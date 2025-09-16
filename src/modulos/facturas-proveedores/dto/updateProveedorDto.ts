import { IsOptional } from 'class-validator';

export class UpdateProveedorDto {

  @IsOptional()
  nombre?: string;

  @IsOptional()
  numero?: string;

  @IsOptional()
  correo?: string;

  @IsOptional()
  direccion?: string;

  @IsOptional()
  id_area?: number;

}
    