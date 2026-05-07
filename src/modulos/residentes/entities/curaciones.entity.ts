import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne, OneToMany} from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';

@Entity()
export class Curaciones{
  @PrimaryGeneratedColumn()
  id_curacion: number;

  @Column({ nullable: true })
  titulo: string;

  @Column({ type: 'text', nullable: false })
  descripcion: string;

  @Column({nullable: false})
  fecha_curacion: Date;

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => Expediente_Residente, expediente => expediente.curaciones, { onDelete: 'CASCADE' })
  expediente: Expediente_Residente;

  @ManyToOne(() => Curaciones, nota => nota.segmentosHijos, { nullable: true })
  notaPadre: Curaciones;

  @OneToMany(() => Curaciones, nota => nota.notaPadre)
  segmentosHijos: Curaciones[];
}