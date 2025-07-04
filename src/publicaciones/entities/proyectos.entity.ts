import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Proyectos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' }) 
  fecha: Date;

  @Column()
  Titulo: string;

  @Column()
  Descripcion: string;

  @Column({ default: true })
  isActive: boolean;
}
