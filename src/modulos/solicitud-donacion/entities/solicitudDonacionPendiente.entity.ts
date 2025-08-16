
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Solicitud_donacion_pendiente{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cedula: string;

    @Column()
    nombre: string;

    @Column()
    apellido1: string;

    @Column({nullable: true})
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
    tipoDonacion: string;

    @Column({default: 'pendiente'})
    estado: 'pendiente' | 'aprobada' | 'rechazada';

    @CreateDateColumn()
    creadoEn: Date;

    @Column({nullable: true})
    observaciones: string;

}


