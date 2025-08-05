import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Donador } from "./donador.entity";


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


  @ManyToOne(() => Donador, d => d.registroDonaciones)
    @JoinColumn({ name: 'donador_id' })
    donador: Donador;


}