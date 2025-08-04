import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RegistroDonacion } from "./registroDonacion.entity";

@Entity()
export class Donador {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: string;

  @Column({type: 'varchar', length: 50})
  nombre: string;

  @Column({type: 'varchar', length: 50})
  apellido1: string;

  @Column({type: 'varchar', length: 50, nullable: true})
  apellido2: string;

  @Column({type: 'varchar', length: 20})
  telefono: string;

  @Column({type: 'varchar', length: 100})
  email: string;

  @CreateDateColumn()
  creadoEn: Date;
  
  @Column({ default: false })
  anonimo: boolean;

  @Column({type: 'varchar', length: 255, nullable: true})
  descripcion: string;

  @OneToMany(() => RegistroDonacion, d => d.donador)
    registroDonaciones: RegistroDonacion[];

}
