import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {

    @ApiProperty({ description: 'ID del usuario', example: 1 })
    @IsInt()
    id: number;

    @ApiProperty({ description: 'Nueva contraseña', example: 'MiNuevaContraseña123' })
    @IsString()
    @MinLength(6)
    newPassword: string;
}
