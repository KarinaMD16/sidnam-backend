import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categoria_Producto } from "./categoriaProducto.entity";
import { Inventario } from "./inventario.entity";
import { Subcategoria_Producto } from "./subCategoriaProducto.entity";


@Entity()
export class Producto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    codigo: string;

    @Column({ default: false, nullable: true })
    archivado: boolean;

    @Column({ nullable: true })
    imagen_url?: string;

    @ManyToOne(() => Categoria_Producto, categoria => categoria.productos)
    @JoinColumn({ name: 'categoria_producto_id' })
    categoria: Categoria_Producto;

    @ManyToOne(() => Subcategoria_Producto, s => s.productos, {
    nullable: true, onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'subcategoria_id' })
    subcategoria?: Subcategoria_Producto | null;

    @OneToMany(() => Inventario, inventario => inventario.producto)
    inventarios: Inventario[];
}