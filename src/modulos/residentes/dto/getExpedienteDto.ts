import { Expose, Transform, Type } from "class-transformer";
import { TipoPensionOptions } from "src/common/enums/tipoPension.enum";
import { ResidenteDto } from "./residenteDto";
import { ResidentePreviewDto } from "./residentePreviewDto";

export class GetExpedienteResidenteDto{

    @Expose()
    id_expediente: number;

    @Expose()
    @Transform(({ obj }) => {
        const tipo = obj.tipo_pension; 
        const match = TipoPensionOptions.find(opt => opt.value === tipo);
        return match ? { id: match.id, nombre: match.nombre } : null;
      })
    tipo_pension: { id: number; nombre: string };

    @Expose()
    @Transform(({ value }) => {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toLocaleDateString('es-CR');
    })
    fecha_ingreso: string; 

    @Expose()
    estado: 'Activo' | 'Inactivo';

    @Expose()
    @Transform(({ value }) => {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toLocaleDateString('es-CR');
    })
    fecha_cierre: string; 

    @Expose()
    @Type(() => ResidenteDto)
    residente: ResidenteDto;

}