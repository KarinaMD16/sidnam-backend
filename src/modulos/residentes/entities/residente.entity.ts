import { Sexo } from 'src/common/enums/rol.enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';
import { estado_civil } from 'src/common/enums/estadoCivil.enum';
import { Encargado } from './encargado.entity';
import { Dependencia } from 'src/common/enums/dependencia.enum';

@Entity()
export class Residente{
  @PrimaryGeneratedColumn()
  id_adulto_mayor: number;

  @Column()
  cedula: string

  @Column()
  nombre: string;

  @Column()
  apellido1: string;

  @Column({ nullable: true })
  apellido2: string;

  @Column()
  email: string;

  @Column({type: 'enum', enum: Sexo})
  sexo: Sexo;

  @Column()
  fecha_nacimiento: Date;

  @Column()
  edad: number;

  @Column({type: 'enum', enum: estado_civil})
  estado_civil: estado_civil;

  @Column({type: 'enum', enum: Dependencia})
  dependencia: Dependencia;

  @OneToOne(() => Expediente_Residente, expediente => expediente.residente)
  expediente: Expediente_Residente;

  @ManyToMany(() => Encargado, encargado => encargado.residentes)
  @JoinTable({ name: 'residente_encargado' }) 
  encargados: Encargado[];
}
