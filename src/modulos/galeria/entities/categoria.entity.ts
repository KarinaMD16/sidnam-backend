
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Galeria } from './galeria.entity';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Galeria, (photo) => photo.categoria)
  fotos: Galeria[];
}

