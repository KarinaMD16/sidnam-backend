import { Type } from "class-transformer";
import { IsArray, isEnum, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { ActualizarEncargadorDto } from "./actualizarEncargadoDto";
import { Sexo } from "src/common/enums/rol.enum";
import { Dependencia } from "src/common/enums/dependencia.enum";


export class ActualizarExpediente{

    @IsOptional()
    fecha_ingreso?: Date;

    @IsOptional()
    tipo_pension?: number;

    @IsOptional()
    cedula?: string;

    @IsOptional()
    nombre?: string;

    @IsOptional()
    apellido1?: string;

    @IsOptional()
    apellido2?: string;

    @IsOptional()
    @IsEnum(Sexo)
    sexo: Sexo;

    @IsOptional()
    estado_civil?: number;

    @IsOptional()
    correo: string;

    @IsOptional()
    edad?: number;

    @IsOptional()
    fecha_nacimiento: Date;

    @IsOptional()
    dependencia?: number;

    @IsOptional()
    lineaPobreza: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ActualizarEncargadorDto)
    encargados?: ActualizarEncargadorDto[];


}