import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne, OneToMany} from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';

@Entity()
export class Consulta_Ebais{
  @PrimaryGeneratedColumn()
  id_consulta_ebais: number;

  @Column({ nullable: true })
  titulo: string;

  @Column({type: 'text', nullable: false })
  descripcion: string;

  @Column({nullable: false})
  fecha_consulta: Date;

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => Expediente_Residente, expediente => expediente.consultasEbais, { onDelete: 'CASCADE' })
  expediente: Expediente_Residente;

  @ManyToOne(() => Consulta_Ebais, consulta => consulta.segmentosHijos, {
  nullable: true,
  })
  notaPadre: Consulta_Ebais;

  @OneToMany(() => Consulta_Ebais, consulta => consulta.notaPadre)
  segmentosHijos: Consulta_Ebais[];
}