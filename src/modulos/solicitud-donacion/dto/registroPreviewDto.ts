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
    aprobadaEn: Date;

    @Expose()
    @Type(() => DonadorDto)
    donador: DonadorDto;
}