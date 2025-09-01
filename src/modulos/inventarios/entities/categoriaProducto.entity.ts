import { CategoriasPrincipalesProductos } from "src/common/enums/categoriasPrincipalesProductos.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./producto.entity";


@Entity()
export class Categoria_Producto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({type: 'enum', enum: CategoriasPrincipalesProductos})
    tipo: CategoriasPrincipalesProductos;

    @Column()
    icono: string;

    @Column()
    descripcion: string;

    @OneToMany(() => Producto, producto => producto.categoria)
    productos: Producto[];
}