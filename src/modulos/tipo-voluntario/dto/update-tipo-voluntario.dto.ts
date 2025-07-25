import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateTipoVoluntarioDto {
 
    
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(30, { message: 'El nombre no puede exceder los 30 caracteres.' })  
  tipoVoluntario: string;

}