import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Donador } from "./donador.entity";


@Entity()
export class RegistroDonacion{

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type: 'varchar', length: 100, nullable: true})
  aprobadaPor: string;

   @CreateDateColumn()
  aprobadaEn: Date;

  @Column({type: 'varchar', length: 100, nullable: true})
  observaciones: string;
 
  @Column({ default: false })
  recibida: boolean;

   @Column({ type: 'timestamp', nullable: true })
   recibidaEn: Date | null;

   @Column()
   recibidaPor: string;

    @Column({ default: false })
    anonimo: boolean;

    @Column()
    tipoDonacion: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    descripcion: string;

  @ManyToOne(() => Donador, d => d.registroDonaciones)
    @JoinColumn({ name: 'donador_id' })
    donador: Donador;

    @Column({ nullable: true })
    idSolicitud: number;

}