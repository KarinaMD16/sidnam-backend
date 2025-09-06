import { IsOptional } from "class-validator";

export class ActualizarFacturaDto{

    @IsOptional()
    numero_factura?: number;

    @IsOptional()
    fecha_emitida?: Date;

    @IsOptional()
    fecha_pago?: Date;

    @IsOptional()
    monto?: number;

    @IsOptional()
    id_proveedor: number;


}