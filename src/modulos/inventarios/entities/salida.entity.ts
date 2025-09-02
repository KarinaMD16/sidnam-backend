import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inventario } from "./inventario.entity";


@Entity()
export class Salida {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'timestamp'})
    fechaSalida: Date;

    @Column()
    cantidad: number;

    @ManyToOne (() => Inventario, inventario => inventario.salidas)
    @JoinColumn({ name: 'inventario_id' })
    inventario: Inventario;

}