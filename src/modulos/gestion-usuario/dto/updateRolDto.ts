import { IsOptional, IsString } from "class-validator";

export class UpdateRolDto {

    @IsOptional()
    nombre?: string;

    @IsOptional()
    descripcion?: string;
}