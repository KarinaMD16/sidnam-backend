import { Expose, Transform, Type } from 'class-transformer';
import { DependenciaOpts } from 'src/common/enums/dependencia.enum';
import { EstadoCivilOptios } from 'src/common/enums/estadoCivil.enum';
import { EncargadorDto } from './EncaregadosDto';
import { LineaPobrezaOPs } from 'src/common/enums/lineaProbeza.enum';

export class ResidenteDto {
  @Expose()
  id_adulto_mayor: number;

  @Expose()
   cedula: string
 
   @Expose()
   nombre: string;
 
   @Expose()
   apellido1: string;
 
   @Expose()
   apellido2: string;

   @Expose()
   email: string;

   @Expose()
   sexo: 'M' | 'F';

   @Expose()
   edad: number;

   @Expose()
   @Transform(({ obj }) => {
     const tipo = obj.estado_civil;
     const match = EstadoCivilOptios.find(opt => opt.value === tipo);
     return match ? { id: match.id, nombre: match.nombre } : null;
   })
   estado_civil: 'Casado' | 'Soltero'

   @Expose()
   @Transform(({ obj }) => {
     const tipo = obj.linea_pobreza; 
     const match = LineaPobrezaOPs.find(opt => opt.value === tipo);
     return match ? { id: match.id, nombre: match.nombre } : null;
   })
   linea_pobreza: { id: number; nombre: string };

   @Expose()
   @Transform(({ obj }) => {
     const tipo = obj.dependencia; 
     const match = DependenciaOpts.find(opt => opt.value === tipo);
     return match ? { id: match.id, nombre: match.nombre } : null;
   })
   dependencia: { id: number; nombre: string };

   @Expose()
   @Transform(({ value }) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toLocaleDateString('es-CR');
  })
   fecha_nacimiento: string;

   @Expose()
   @Type(() => EncargadorDto)
   encargados: EncargadorDto[];

}
