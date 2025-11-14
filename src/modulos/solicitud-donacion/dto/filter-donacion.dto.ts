import { IsOptional, IsString, IsNumberString, IsIn } from "class-validator";

export class FiltrarDonacionesDto {

  @IsIn(['solicitud', 'registro'])
  origen: 'solicitud' | 'registro';

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  recibida?: string;

  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @IsOptional()
  @IsString()
  fechaFin?: string;

  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}
