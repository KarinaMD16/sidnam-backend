// subcategoriaProducto.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Producto } from './producto.entity';

@Entity()
@Unique('uq_subcategoria_nombre', ['nombre']) // opcional, evita duplicados globales
export class Subcategoria_Producto {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string; 

  @OneToMany(() => Producto, p => p.subcategoria)
  productos: Producto[];

}
