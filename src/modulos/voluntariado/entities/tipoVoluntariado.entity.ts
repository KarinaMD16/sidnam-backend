import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { SolicitudAprobada } from './solicitudAprobada.entity';

@Entity()
export class Tipo_voluntariado{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string; 

  @CreateDateColumn()
  aprobadaEn: Date;

  @OneToMany(() => SolicitudAprobada, solicitud => solicitud.tipoVoluntariado)
  solicitudes: SolicitudAprobada[];
}
