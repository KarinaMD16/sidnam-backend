import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./producto.entity";
import { Entrada } from "./entrada.entity";
import { Salida } from "./salida.entity";
import { Unidad_Medida } from "src/modulos/residentes/entities/unidadMedida.entity";


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

    @ManyToOne(() => Unidad_Medida, unidad_medida => unidad_medida.inventarios)
    @JoinColumn({ name: 'unidad_medida_id' })
    unidad_medida: Unidad_Medida;

}