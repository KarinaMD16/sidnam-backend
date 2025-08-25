import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne} from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';

@Entity()
export class Consulta_Ebais{
  @PrimaryGeneratedColumn()
  id_consulta_ebais: number;

  @Column({ nullable: true })
  titulo: string;

  @Column({ nullable: false })
  descripcion: string;

  @Column({nullable: false})
  fecha_consulta: Date;

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => Expediente_Residente, expediente => expediente.consultasEbais, { onDelete: 'CASCADE' })
  expediente: Expediente_Residente;

}