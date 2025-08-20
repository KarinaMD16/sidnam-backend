import { Expose, Transform, Type } from 'class-transformer';
import { DependenciaOpts } from 'src/common/enums/dependencia.enum';
import { EstadoCivilOptios } from 'src/common/enums/estadoCivil.enum';
import { EncargadorDto } from './EncaregadosDto';

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
   estado_civil: 'Casado' | 'Soltero'

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
