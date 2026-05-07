import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne, OneToMany} from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';
import { Tipo_Consulta } from './tipoConsulta.entity';

@Entity()
export class Consulta_Especialista{
  @PrimaryGeneratedColumn()
  id_consulta_especialista: number;

  @Column({ nullable: true })
  titulo: string;

  @Column({type: 'text', nullable: false })
  descripcion: string;

  @Column({nullable: false})
  fecha_consulta: Date;

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => Expediente_Residente, expediente => expediente.consultasEspecialistas, { onDelete: 'CASCADE' })
  expediente: Expediente_Residente;

  @ManyToOne(() => Tipo_Consulta, tipoConsulta => tipoConsulta.consultas, { onDelete: 'CASCADE' })
  tipoConsulta: Tipo_Consulta;

  @ManyToOne(() => Consulta_Especialista, consulta => consulta.segmentosHijos, {
  nullable: true,
  })
  notaPadre: Consulta_Especialista;

  @OneToMany(() => Consulta_Especialista, consulta => consulta.notaPadre)
  segmentosHijos: Consulta_Especialista[];

}