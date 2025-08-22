import { Type } from "class-transformer";
import { IsArray, isEnum, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { ActualizarEncargadorDto } from "./actualizarEncargadoDto";
import { Sexo } from "src/common/enums/rol.enum";
import { estado_civil } from "src/common/enums/estadoCivil.enum";
import { Dependencia } from "src/common/enums/dependencia.enum";
import { tipo_pension } from "src/common/enums/tipoPension.enum";

export class ActualizarExpediente{

    @IsOptional()
    fecha_ingreso?: Date;

    @IsOptional()
    @IsEnum(tipo_pension)
    tipo_pension?: tipo_pension;

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
    @IsEnum(estado_civil)
    estado_civil?: estado_civil;

    @IsOptional()
    @IsEnum(Dependencia)
    dependencia?: Dependencia;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ActualizarEncargadorDto)
    encargados?: ActualizarEncargadorDto[];


}