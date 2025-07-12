import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { IsCedula } from "src/common/validators/cedula.validator";


export class CreateReporteDonacionDto { 

    
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
    @MaxLength(75, { message: 'El correo no puede exceder los 75 caracteres.' })
    @IsOptional()
    @IsEmail()
    correo: string;

     
    @IsString()
    @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
    @MaxLength(15, { message: 'El teléfono no puede exceder los 15 caracteres.' })
    telefono: string;


    @IsString()
    @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres.' })
    @IsOptional()
    descripcion?: string;
    
   
    @IsOptional()
    @IsInt({ message: 'El monto debe ser un número entero.' })
    monto?: number;

    
    @IsOptional()
    @IsDateString({},{ message: 'La fecha de donación debe ser una fecha válida.' })
    fechaDonacion?: Date;

     
    @IsString()
    @IsOptional()
    @MaxLength(100, { message: 'Las observaciones no pueden exceder los 100 caracteres.' })
    observaciones: string;

 
    @IsNotEmpty({ message: 'El tipo es obligatorio.' })
    @IsInt({ message: 'El id de tipo debe ser un numero entero.' })
    idTipo: number; 

}