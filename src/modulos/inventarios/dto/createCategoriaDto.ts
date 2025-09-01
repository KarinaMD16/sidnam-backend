import { IsNotEmpty } from "class-validator";

export class CreateCategoriaDto{

    @IsNotEmpty()
    nombre: string;

}