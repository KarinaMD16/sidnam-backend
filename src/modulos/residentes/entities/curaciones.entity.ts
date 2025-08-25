import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne} from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';

@Entity()
export class Curaciones{
  @PrimaryGeneratedColumn()
  id_curacion: number;

  @Column({ nullable: true })
  titulo: string;

  @Column({ nullable: false })
  descripcion: string;

  @Column({nullable: false})
  fecha_curacion: Date;

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => Expediente_Residente, expediente => expediente.curaciones, { onDelete: 'CASCADE' })
  expediente: Expediente_Residente;
}