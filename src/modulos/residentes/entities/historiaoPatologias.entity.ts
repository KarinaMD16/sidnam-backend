import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Patologias } from './patologias.entity';
import { Expediente_Residente } from './expedientes.entity';

@Entity()
export class HistorialPatologias {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Expediente_Residente, residente => residente.historialPatologias)
  residente: Expediente_Residente;

  @ManyToOne(() => Patologias)
  patologia: Patologias;

  @Column({ default: 'activo' })
  estado: string; 

  @CreateDateColumn()
  fecha_registro: Date;
}
