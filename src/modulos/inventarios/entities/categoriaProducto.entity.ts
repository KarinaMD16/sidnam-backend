import { CategoriasPrincipalesProductos } from "src/common/enums/categoriasPrincipalesProductos.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Categoria_Producto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
    type: 'enum',
    enum: CategoriasPrincipalesProductos,
    })
    nombre: CategoriasPrincipalesProductos;

    @Column()
    icono: string;

    @Column()
    descripcion: string;

}