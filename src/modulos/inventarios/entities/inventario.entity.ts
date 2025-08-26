import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./producto.entity";
import { Entrada } from "./entrada.entity";
import { Salida } from "./salida.entity";


@Entity()
export class Inventario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    stock: number;

    @ManyToOne(() => Producto, producto => producto.inventarios)
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;

    @OneToMany(() => Entrada, entrada => entrada.inventario)
    entradas: Entrada[];

    @OneToMany(() => Salida, salida => salida.inventario)
    salidas: Salida[];

}