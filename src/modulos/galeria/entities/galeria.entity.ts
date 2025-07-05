
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from './categoria.entity';

@Entity()
export class Galeria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  imagenUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Categoria, (categoria) => categoria.fotos)
  @JoinColumn({ name: 'categoriaId' }) 
  categoria: Categoria;

  @Column()
  categoriaId: number;

}

