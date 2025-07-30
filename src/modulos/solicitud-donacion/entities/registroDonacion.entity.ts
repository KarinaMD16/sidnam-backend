import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tipo_donacion } from "./tipoDonacion.entity";
import { Donacion } from "./Donacion.entity";


@Entity()
export class RegistroDonacion{

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type: 'varchar', length: 100, nullable: true})
  datosExtra: string;

  @Column({type: 'varchar', length: 100})
  observaciones: string;

  @CreateDateColumn()
  aprobadaEn: Date;

  @ManyToOne(() => Tipo_donacion, tipo => tipo.solicitudes)
    @JoinColumn({ name: 'tipo_donacion_id' })
    tipoDonacion: Tipo_donacion;

  @ManyToOne(() => Donacion, d => d.solicitudesAprobadas)
    @JoinColumn({ name: 'solicitud_donacion_id' })
    solicitudDonacion: Donacion;


}