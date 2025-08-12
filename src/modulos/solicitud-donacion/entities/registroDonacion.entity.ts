import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Donador } from "./donador.entity";


@Entity()
export class RegistroDonacion{

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type: 'varchar', length: 100, nullable: true})
  aprobadaPor: string;

  @Column({type: 'varchar', length: 100, nullable: true})
  observaciones: string;

  @CreateDateColumn()
  aprobadaEn: Date;

  @Column({ default: false })
  recibida: boolean;

   @Column({ type: 'timestamp', nullable: true })
   recibidaEn: Date | null;

  @ManyToOne(() => Donador, d => d.registroDonaciones)
    @JoinColumn({ name: 'donador_id' })
    donador: Donador;

}