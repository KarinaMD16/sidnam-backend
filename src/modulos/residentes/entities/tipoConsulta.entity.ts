import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne, OneToMany} from 'typeorm';
import { Consulta_Especialista } from './consultaEspecialista.entity';

@Entity()
export class Tipo_Consulta{
  @PrimaryGeneratedColumn()
  id_tipo_consulta: number;

  @Column({ nullable: false })
  nombre: string;

  @OneToMany(() => Consulta_Especialista, consulta => consulta.tipoConsulta, { onDelete: 'CASCADE' })
  consultas: Consulta_Especialista[];

}