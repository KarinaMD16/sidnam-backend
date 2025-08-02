import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('solicitud_donacion_pendiente')
export class Solicitud_pendiente{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    apellido1: string;

    @Column()
    apellido2: string;

    @Column()
    telefono: string;

    @Column()
    email: string;

    @Column({ default: false, nullable: true })
    anonimo: boolean;

    @Column()
    descripcion: string;

    @Column()
    tipoDonacion: number

    @Column({default: 'pendiente'})
    estado: 'pendiente' | 'aprobada' | 'rechazada';

    @CreateDateColumn()
    creadoEn: Date;

    @Column({nullable: true})
    observaciones: string;

}