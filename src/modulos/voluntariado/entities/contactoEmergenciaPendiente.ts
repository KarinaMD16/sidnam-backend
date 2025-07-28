import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SolicitudPendiente } from "./solicitudPendiente.entity";

@Entity()
export class ContactoEmergenciaPendiente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  telefono: string;

  @ManyToOne(() => SolicitudPendiente, solicitud => solicitud.contactosEmergencia, { onDelete: 'CASCADE' })
  solicitudPendiente: SolicitudPendiente;
}