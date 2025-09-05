// subcategoriaProducto.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Producto } from './producto.entity';

@Entity()
export class Subcategoria_Producto {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string; 

  @OneToMany(() => Producto, p => p.subcategoria)
  productos: Producto[];

}
