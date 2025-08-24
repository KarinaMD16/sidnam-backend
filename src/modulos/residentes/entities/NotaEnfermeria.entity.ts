import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';


@Entity()
export class NotaEnfermeria {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Expediente_Residente, expediente => expediente.notas, { nullable: false })
  expediente: Expediente_Residente; 

  @Column('text')
  segmento: string; 

  @Column('text', { nullable: true })
  titulo: string;

  @ManyToOne(() => NotaEnfermeria, nota => nota.segmentosHijos, { nullable: true })
  notaPadre: NotaEnfermeria; 
  @OneToMany(() => NotaEnfermeria, nota => nota.notaPadre)
  segmentosHijos: NotaEnfermeria[]; 

  @CreateDateColumn()
  fecha: Date;
}
