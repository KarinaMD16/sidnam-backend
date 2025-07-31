
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Donacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' }) 
  fecha: Date;

  @Column()
  Titulo: string;

  @Column()
  Descripcion: string;

  @Column({ nullable: true })
  imagenUrl: string;

  @Column({ default: true })
  isActive: boolean;
}

