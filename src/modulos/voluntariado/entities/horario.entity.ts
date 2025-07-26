import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SolicitudAprobada } from './solicitudAprobada.entity';


@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dia: string; 

  @Column()
  horaInicio: string; 

  @Column()
  horaFin: string; 

  @ManyToOne(() => SolicitudAprobada, solicitud => solicitud.horarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'solicitud_aprobada_id' })
  solicitud: SolicitudAprobada;
}
