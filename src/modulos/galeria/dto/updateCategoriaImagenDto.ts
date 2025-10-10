import { IsInt, Min } from 'class-validator';

export class UpdateCategoriaImagenDto {

  @IsInt({ message: 'El id de la nueva categoría debe ser un número entero' })
  @Min(1, { message: 'El id de la nueva categoría debe ser mayor que 0' })
  categoriaId: number;

}