import { IsNotEmpty } from "class-validator";

export class CreateUnidadMedidaDto{
    @IsNotEmpty()
    nombre: string;

    @IsNotEmpty()
    abreviatura: string;
}