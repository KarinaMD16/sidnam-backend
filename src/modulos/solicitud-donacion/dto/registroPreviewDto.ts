import { Expose, Type } from "class-transformer";
import { DonadorDto } from "./donadorDto";


export class RegistroPreviewDto {

    @Expose()
    id: number;

    @Expose()
    tipoDonacion: string;

    @Expose()
    recibida: boolean;

    @Expose()
    recibidaEn: Date;

    @Expose()
    aprobadaPor: string;

    @Expose()
    @Type(() => DonadorDto)
    donador: DonadorDto;
}