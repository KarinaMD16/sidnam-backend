
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsEmail,
  IsString,
  IsJSON,
} from 'class-validator';
import { Sexo, HorarioType } from '../entities/voluntarios.entity';

export class CreateVoluntarioDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  cedula: string;

  @IsNotEmpty()
  @IsEnum(Sexo)
  sexo: Sexo;

  @IsOptional()
  @IsString()
  ocupacion?: string;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsOptional()
  @IsString()
  emergenciaNombre?: string;

  @IsOptional()
  @IsString()
  emergenciaTelefono?: string;

  @IsOptional()
  @IsString()
  tipoColaboracion?: string;

  @IsOptional()
  @IsString()
  experienciaLaboral?: string;

  @IsOptional()
  @IsJSON()
  horarios? : HorarioType

  @IsOptional()
  @IsString()
  observaciones?: string;
}