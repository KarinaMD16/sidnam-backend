import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SolicitudAprobada } from './solicitudAprobada.entity';

@Entity()
export class Tipo_voluntariado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @OneToMany(() => SolicitudAprobada, solicitud => solicitud.tipoVoluntariado)
  solicitudes: SolicitudAprobada[];
}