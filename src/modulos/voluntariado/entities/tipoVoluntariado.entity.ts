import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { SolicitudAprobada } from './solicitudAprobada.entity';
import { TipoVoluntario } from 'src/common/enums/tipoVoluntarios.enum';

@Entity()
export class Tipo_voluntariado{

  @PrimaryGeneratedColumn()
  id: number;

   @Column({
    type: 'enum',
    enum: TipoVoluntario,
  }) 

  nombre: TipoVoluntario

  @OneToMany(() => SolicitudAprobada, solicitud => solicitud.tipoVoluntariado)
  solicitudes: SolicitudAprobada[];
}
