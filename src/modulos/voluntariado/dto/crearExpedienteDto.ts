import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Sexo } from "src/common/enums/rol.enum";
import { ContactoEmergenciaPendienteDto } from "./ContactoEmergenciaPendienteDto";
import { HorarioPendienteDto } from "./horarioPendienteDto";

export class CrearExpediente{
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido1: string;

  @IsString()
  @IsOptional()
  apellido2: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  ocupacion: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsEnum(Sexo)
  sexo: Sexo;

  @IsOptional()
  @IsString()
  experienciaLaboral?: string;

  @IsNumber()
  tipoVoluntariado: number;

  @IsNumber()
  @IsOptional()
  cantidadHoras: number

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactoEmergenciaPendienteDto)
  contactosEmergencia?: ContactoEmergenciaPendienteDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HorarioPendienteDto)
  horarios?: HorarioPendienteDto[];

  @IsOptional()
  @IsString()
  observaciones?: string;
}