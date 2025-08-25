import { Expose, Transform } from "class-transformer";

export class MostrarConsultaEbais {
  
  @Expose()
  id_consulta_ebais: number;

  @Expose()
  @Transform(({ value }) => {
      const d = value.getDate().toString().padStart(2, '0');
      const m = (value.getMonth() + 1).toString().padStart(2, '0');
      const y = value.getFullYear().toString().slice(-2);
      return `${d}-${m}-${y}`;
    })
  fecha_consulta: Date;

  @Expose()
  titulo: string;

  @Expose() 
  descripcion: string;
  
}
