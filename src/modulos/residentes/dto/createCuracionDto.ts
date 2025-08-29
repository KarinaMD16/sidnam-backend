import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCuracionDto{
    @IsOptional()
    titulo: string;
    
    @IsNotEmpty()
    descripcion: string;

    @IsNotEmpty()
    fecha_curacion: Date;
}