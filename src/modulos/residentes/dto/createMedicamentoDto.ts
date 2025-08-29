import { IsNotEmpty } from "class-validator";

export class CreateMedicamentoDto{
    @IsNotEmpty()
    nombre: string;
}