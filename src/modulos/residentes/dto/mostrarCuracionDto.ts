import { Expose, Transform } from "class-transformer";

export class MostrarCuracionDto {
  
  @Expose()
  id_curacion: number;

  @Expose()
  @Transform(({ value }) => {
      const d = value.getDate().toString().padStart(2, '0');
      const m = (value.getMonth() + 1).toString().padStart(2, '0');
      const y = value.getFullYear().toString().slice(-2);
      return `${d}-${m}-${y}`;
    })
  fecha_curacion: Date;

  @Expose()
  titulo: string;

  @Expose() 
  descripcion: string;
  
  @Expose()
  tratamiento: string;
}
