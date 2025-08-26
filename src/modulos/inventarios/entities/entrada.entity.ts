import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inventario } from "./inventario.entity";


@Entity()
export class Entrada{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fechaEntrada: Date;

    @Column()
    cantidad: number;

    @ManyToOne(() => Inventario, inventario => inventario.entradas)
    @JoinColumn({ name: 'inventario_id' })
    inventario: Inventario;

}