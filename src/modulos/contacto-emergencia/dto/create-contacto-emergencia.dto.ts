import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateContactoEmergenciaDto {

    @IsString()
    @IsNotEmpty({ message: 'El contacto es obligatorio.' })
    @MaxLength(50, { message: 'El contacto no puede exceder los 50 caracteres.' })
    contacto: string;


    @IsString()
    @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
    @MaxLength(15, { message: 'El teléfono no puede exceder los 15 caracteres.' })
    telefono: string;
}