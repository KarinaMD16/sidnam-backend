import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Inventario } from "./inventario.entity";
import { Subcategoria_Producto } from "./subCategoriaProducto.entity";
import { CategoriasPrincipalesProductos } from "src/common/enums/categoriasPrincipalesProductos.enum";


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

    @Column({ type: 'enum', enum: CategoriasPrincipalesProductos })
    categoriaTipo: CategoriasPrincipalesProductos;

    @ManyToOne(() => Subcategoria_Producto, s => s.productos, {
    nullable: true, onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'subcategoria_id' })
    subcategoria?: Subcategoria_Producto | null;

    @OneToMany(() => Inventario, inventario => inventario.producto)
    inventarios: Inventario[];
}