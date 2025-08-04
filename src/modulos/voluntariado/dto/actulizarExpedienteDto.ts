import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Sexo } from "src/common/enums/rol.enum";
import { ContactoEmergenciaPendienteDto } from "./ContactoEmergenciaPendienteDto";

export class ActualizarExpedienteDto{

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre: string;
 
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  apellido1: string;

  @IsOptional()
  @IsString()
  apellido2: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ocupacion: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsOptional()
  @IsEnum(Sexo)
  sexo: Sexo;

  @IsOptional()
  @IsString()
  experienciaLaboral?: string;

  @IsOptional()
  @IsNumber()
  cantidadHoras: number

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactoEmergenciaPendienteDto)
  contactosEmergencia?: ContactoEmergenciaPendienteDto[];

  @IsOptional()
  @IsString()
  observaciones?: string;
}