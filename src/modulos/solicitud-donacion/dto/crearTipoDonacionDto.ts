import { IsNotEmpty, IsString } from "class-validator";


export class TipoDonacionDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;
}