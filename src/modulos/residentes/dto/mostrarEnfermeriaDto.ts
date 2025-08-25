import { Expose, Transform, Type } from "class-transformer";
import { ResidneteEnfermeriaDto } from "./residenteEnfermeriaDto";

export class NotaEnfermeriaDto {
  @Expose()
  id: number;

  @Expose()
  titulo: string;

  @Expose()
  segmento: string;

  @Expose()
  @Transform(({ value }) => {
    const d = value.getDate().toString().padStart(2, '0');
    const m = (value.getMonth() + 1).toString().padStart(2, '0');
    const y = value.getFullYear().toString().slice(-2);
    return `${d}-${m}-${y}`;
  })
  fecha: string;

  @Expose()
  residenteId: number;
}

export class PatologiaDto {
  @Expose()
  id: number;

  @Expose()
  nombre: string;
}

export class ExpedienteEnfermeriaDto {

  @Expose()
  estado: string;

  @Expose()
  @Type(() => ResidneteEnfermeriaDto)
  residente: ResidneteEnfermeriaDto;

  @Expose()
  @Type(() => PatologiaDto)
  patologias: PatologiaDto[];
}