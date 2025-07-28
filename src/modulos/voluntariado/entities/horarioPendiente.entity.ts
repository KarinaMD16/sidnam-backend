import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";
import { SolicitudPendiente } from "./solicitudPendiente.entity";

@Entity()
export class HorarioPendiente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dia: string;

  @Column()
  horaInicio: string;

  @Column()
  horaFin: string;

  @ManyToOne(() => SolicitudPendiente, solicitud => solicitud.horarios, { onDelete: 'CASCADE' })
  solicitudPendiente: SolicitudPendiente;
}