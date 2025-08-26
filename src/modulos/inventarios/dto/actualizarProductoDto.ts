import { IsBoolean, IsInt, IsOptional, IsString} from "class-validator";


export class ActualizarProductoDto {

    @IsOptional()
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    codigo: string;

    @IsOptional()
    @IsBoolean()
    archivado: boolean;

    @IsOptional()
    @IsString()
    unidadMedida: string;

    @IsOptional()
    @IsInt()
    categoriaProducto: number;
}