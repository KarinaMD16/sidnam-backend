import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateConsultaEspecialista{
    @IsOptional()
    titulo: string;
    
    @IsNotEmpty()
    descripcion: string;

    @IsNotEmpty()
    fecha_consulta: Date;
}