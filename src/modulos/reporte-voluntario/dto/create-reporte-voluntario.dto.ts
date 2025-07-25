import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { IsCedula } from "src/common/validators/cedula.validator";


export class CreateReporteVoluntarioDto { 

    
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres.' })
    nombre: string;

  
    @IsString()
    @IsNotEmpty({ message: 'El apellido es obligatorio.' })
    @MaxLength(50, { message: 'El apellido no puede exceder los 50 caracteres.' })
    apellido: string;

    
    @IsString()
    @MaxLength(50, { message: 'El segundo apellido no puede exceder los 50 caracteres.' })
    @IsOptional()
    segundoApellido?: string;

     
    @IsString()
    @IsNotEmpty({ message: 'La cédula es obligatoria.' })
    @MaxLength(25, { message: 'La cédula no puede exceder los 25 caracteres.' })
    @IsCedula()
    cedula: string;

    @IsString()
    @MaxLength(20, { message: 'El sexo no puede exceder los 20 caracteres.' })
    @IsNotEmpty({ message: 'El sexo es obligatorio.' })
    sexo: string;


    @IsString()
    @MaxLength(50, { message: 'La ocupación no puede exceder los 50 caracteres.' })
    @IsNotEmpty({ message: 'La ocupación es obligatoria.' })
    ocupacion: string;

    @IsString()
    @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
    @MaxLength(15, { message: 'El teléfono no puede exceder los 15 caracteres.' })
    telefono: string;

    
    @IsString()
    @MaxLength(75, { message: 'El correo no puede exceder los 75 caracteres.' })
    @IsOptional()
    @IsEmail()
    correo: string;


    @IsString()
    @MaxLength(150, { message: 'La dirección no puede exceder los 150 caracteres.' })
    @IsNotEmpty({ message: 'La dirección es obligatoria.' })
    direccion: string;


    @IsString()
    @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres.' })
    @IsNotEmpty({ message: 'La descripción es obligatoria.' })
    descripcion: string;

    @IsString()
    @MaxLength(20, { message: 'El contacto de emergencia no puede exceder los 20 caracteres.' })
    @IsOptional()
    contactoEmergencia: string;

    @IsString()
    @MaxLength(500, { message: 'La experiencia no puede exceder los 500 caracteres.' })
    @IsOptional()
    experiencia: string;


    @IsString()
    @IsOptional()
    @MaxLength(500, { message: 'Las observaciones no pueden exceder los 100 caracteres.' })
    observaciones: string;


    @IsNotEmpty({ message: 'El tipo es obligatorio.' })
    @IsInt({ message: 'El id de tipo debe ser un numero entero.' })
    idTipoVoluntario: number;
    
}

