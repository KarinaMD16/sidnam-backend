import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categoria_Producto } from "./categoriaProducto.entity";
import { Inventario } from "./inventario.entity";


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

    @Column()
    unidadMedida: string;

    @ManyToOne(() => Categoria_Producto, categoria => categoria.productos)
    @JoinColumn({ name: 'categoria_producto_id' })
    categoria: Categoria_Producto;


    @OneToMany(() => Inventario, inventario => inventario.producto)
    inventarios: Inventario[];
}