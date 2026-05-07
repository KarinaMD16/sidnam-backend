import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';

@Entity()
export class Libro_Campo {
  @PrimaryGeneratedColumn()
  id_libro_campo: number;

  @ManyToOne(() => Expediente_Residente, expediente => expediente.librosCampo, { nullable: false })
  expediente: Expediente_Residente; 

  @Column({ nullable: false })
  fecha_actividad: Date;

  @Column('text', { nullable: false })
  problematica_abordada: string;

  @Column('text', { nullable: false })
  descripcion: string;

  @Column('text', { nullable: false })
  acuerdo_alcanzado: string;

  @ManyToOne(() => Libro_Campo, nota => nota.segmentosHijos, { nullable: true })
  notaPadre: Libro_Campo; 
  
  @OneToMany(() => Libro_Campo, nota => nota.notaPadre)
  segmentosHijos: Libro_Campo[]; 

  @CreateDateColumn()
  fecha: Date;
}
