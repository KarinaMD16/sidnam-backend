import { Expose, Type } from "class-transformer";
import { DonadorRegistroDto } from "./verDonadorRegistroDto";


export class RegistroDto {
    @Expose()
    id: number;

    @Expose()
    @Type(() => DonadorRegistroDto)
    donador: DonadorRegistroDto;

    @Expose()
    anonimo: boolean;
    
    @Expose()
    aprobadaPor: string;

    @Expose()
    aprobadaEn: Date;

    @Expose()
    tipoDonacion: string;

    @Expose()
    descripcion: string;

    @Expose()
    observaciones: string;

    @Expose()
    recibida: boolean;

    @Expose()
    recibidaEn: Date | null;

    @Expose()
    recibidaPor: string;

  
}