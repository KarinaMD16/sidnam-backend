import { Expose, Type } from "class-transformer";
import { InformacionPersonalResidenteDto } from "./informacionPersonalResidenteDto";

export class getEStadoExpedienteDto {
    @Expose()
    id_expediente: number;

    @Expose()
    estado: 'Activo' | 'Inactivo';

    @Expose()
       @Type(() => InformacionPersonalResidenteDto)
       residente: InformacionPersonalResidenteDto;
}