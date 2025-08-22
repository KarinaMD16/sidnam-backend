// create-expediente-completo.dto.ts
import { IsNotEmpty, IsEmail, IsEnum, IsDateString, IsOptional, IsNumber, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { Sexo } from 'src/common/enums/rol.enum';


export class CreateEncargadoDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  cedula: string;

  @IsNotEmpty()
  apellido1: string;

  @IsOptional()
  apellido2?: string;

  @IsNotEmpty()
  telefono: string;

  @IsEmail()
  correo: string;
}

export class CreateResidenteDto {
  @IsNotEmpty()
  cedula: string;

  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido1: string;

  @IsOptional()
  apellido2?: string;

  @IsEmail()
  email: string;

  @IsEnum(Sexo)
  sexo: Sexo;

  @IsDateString()
  fecha_nacimiento: Date;

  @IsNumber()
  edad: number;

  @IsNumber()
  estado_civil: number;

  @IsNotEmpty()
  dependencia: number;

  @ValidateNested({ each: true })
  @Type(() => CreateEncargadoDto)
  @ArrayMinSize(1)
  encargados: CreateEncargadoDto[];
}

export class  CreateExpedienteCompletoDto {
  @IsNotEmpty()
  tipo_pension: number;

  @IsDateString()
  fecha_ingreso: Date;

  @ValidateNested()
  @Type(() => CreateResidenteDto)
  residente: CreateResidenteDto;
}
