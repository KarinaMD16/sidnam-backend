import { Expose, Transform, Type } from "class-transformer";
import { MostrarProveedoresFacturas } from "./mostrarProveedorEnFacturaDto";

export class MostrarFacturaDto{

    @Expose()
    id_factura: number;

    @Expose()
    numero_factura: number;

    @Expose()
    @Transform(({ value }) => {
        const d = value.getDate().toString().padStart(2, '0');
        const m = (value.getMonth() + 1).toString().padStart(2, '0');
        const y = value.getFullYear().toString().slice(-2);
        return `${d}-${m}-${y}`;
    })
    fecha_emitida: string;

    @Expose()
    @Transform(({ value }) => {
        const d = value.getDate().toString().padStart(2, '0');
        const m = (value.getMonth() + 1).toString().padStart(2, '0');
        const y = value.getFullYear().toString().slice(-2);
        return `${d}-${m}-${y}`;
    })
    fecha_pago: string;

    @Expose()
    monto: number;

    @Expose()
    estado: 'pagada' | 'pendiente'

    @Expose()
    @Type(() => MostrarProveedoresFacturas)
    proveedor: MostrarProveedoresFacturas;
    
}