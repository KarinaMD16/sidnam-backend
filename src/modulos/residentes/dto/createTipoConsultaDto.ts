import { IsNotEmpty } from "class-validator";

export class createTipoConsultaDto{
    @IsNotEmpty()
    nombre: string;
}