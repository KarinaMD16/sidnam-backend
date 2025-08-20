import { Expose, Transform, Type } from 'class-transformer';
import { ResidentePreviewDto } from './residentePreviewDto';
import { TipoPensionOptions } from 'src/common/enums/tipoPension.enum';
import { EstadoExpedienteOptions } from 'src/common/enums/estadosExpedientes.enum';

export class ExpedienteResidentePreviewDto {
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
  @Transform(({ obj }) => {
    const estado = obj.estado; 
    const match = EstadoExpedienteOptions.find(opt => opt.value === estado);
    return match ? { id: match.id, nombre: match.nombre } : null;
  })
  estado: { id: number; nombre: string };

  @Expose()
    @Type(() => ResidentePreviewDto)
    residente: ResidentePreviewDto;
    
}
