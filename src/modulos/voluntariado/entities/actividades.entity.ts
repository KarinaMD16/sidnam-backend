import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SolicitudAprobada } from './solicitudAprobada.entity';


@Entity()
export class Actividades {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date; 

  @Column({ nullable: true })
  cantidadHoras: number; 

  @Column()
  actividades: string;
 
  @ManyToOne(() => SolicitudAprobada, solicitud => solicitud.actividades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'solicitud_aprobada_id' })
  solicitud: SolicitudAprobada;
}
