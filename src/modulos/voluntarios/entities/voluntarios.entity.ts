import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum Sexo {
    M = 'M',
    F = 'F',
}

export enum Estado {
    PENDIENTE = 'Pendiente',
    APROBADA  = 'Aprobada',
    RECHAZADA = 'Rechazada'
}

export type HorarioType = { [dia: string]: string }

@Entity()
export class Voluntarios {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({unique: true})
    cedula: string;

    @Column({ type: 'enum', enum: Sexo })
    sexo: Sexo;

    @Column({ nullable: true })
    ocupacion?: string;

    @Column()
    telefono: string;

    @Column()
    email: string;

    @Column()
    direccion: string;

    @Column({ nullable: true })
    emergenciaNombre?: string;

    @Column({ nullable: true })
    emergenciaTelefono?: string;

    @Column({ type: 'text', nullable: true })
    tipoColaboracion?: string;

    @Column({ type: 'text', nullable: true })
    experienciaLaboral?: string;

    @Column({ type: 'simple-json', nullable: true })
    horarios?: HorarioType

    @Column({ type: 'text', nullable: true })
    observaciones?: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'enum', enum: Estado, default:Estado.PENDIENTE })
    estado: Estado

}


