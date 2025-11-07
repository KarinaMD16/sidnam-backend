import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreatePasswordDto {
    @ApiProperty({ description: 'Nueva contraseña', example: 'MiNuevaContraseña123' })
    @IsString()
    @MinLength(6)
    password: string;
}