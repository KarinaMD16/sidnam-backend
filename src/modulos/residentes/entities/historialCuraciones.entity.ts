import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';

@Entity()
export class HistorialCuraciones {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Expediente_Residente, residente => residente.historialCuraciones)
  residente: Expediente_Residente;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @Column()
  fecha_curacion: Date;

  @CreateDateColumn()
  fecha_registro: Date;
}
