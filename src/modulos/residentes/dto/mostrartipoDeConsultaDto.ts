import { Expose } from "class-transformer";

export class MostrarTipoDeConsultaDto {
    @Expose()
    id_tipo_consulta: number;
    @Expose()
    nombre: string;
}