import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Sexo } from "src/common/enums/rol.enum";
import { ContactoEmergenciaPendienteDto } from "./ContactoEmergenciaPendienteDto";
import { HorarioDto } from "./horarioDto";

export class ActualizarExpedienteDto{

  @IsOptional()
  @IsString()
  cedula: string;

  @IsOptional()
  @IsString()
  nombre: string;
 
  @IsOptional()
  @IsString()
  apellido1: string;

  @IsOptional()
  @IsString()
  apellido2: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  telefono: string;

  @IsOptional()
  @IsString()
  ocupacion: string;

  @IsOptional()
  @IsString()
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
 @Type(() => HorarioDto)
 horarios?: HorarioDto[];


  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactoEmergenciaPendienteDto)
  contactosEmergencia?: ContactoEmergenciaPendienteDto[];

  @IsOptional()
  @IsString()
  observaciones?: string;
}