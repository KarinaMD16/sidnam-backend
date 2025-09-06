import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFacturaDto {


    @IsNotEmpty()
    @IsNumber()
    proveedor_id: number;
    
    @IsNotEmpty()
    @IsNumber()
    numero_factura: number;

    @IsNotEmpty()
    @IsString()
    fecha_emision: string;

    @IsNotEmpty()
    @IsString()
    fecha_pago: string;

    @IsNotEmpty()
    @IsNumber()
    monto: number;
}