import { Sexo } from 'src/common/enums/rol.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ContactoEmergenciaPendiente } from './contactoEmergenciaPendiente';
import { HorarioPendiente } from './horarioPendiente.entity';


@Entity()
export class SolicitudPendiente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: string

  @Column()
  nombre: string;

  @Column()
  apellido1: string;

  @Column({ nullable: true })
  apellido2: string;

  @Column()
  email: string;

  @Column()
  telefono: string;

  @Column()
  ocupacion: string;

  @Column()
  direccion: string;

  @Column({type: 'enum', enum: Sexo})
  sexo: Sexo;

  @Column({ type: 'text', nullable: true })
  experienciaLaboral?: string;

  @Column()
  tipoVoluntariado: number

  @Column({ nullable: true })
  cantidadHoras: number
  
  @Column({ default: 'pendiente' })
  estado: 'pendiente' | 'aprobada' | 'rechazada';

  @CreateDateColumn()
  creadoEn: Date;

  @OneToMany(() => ContactoEmergenciaPendiente, contacto => contacto.solicitudPendiente, { cascade: true })
  contactosEmergencia: ContactoEmergenciaPendiente[];

  @OneToMany(() => HorarioPendiente, horario => horario.solicitudPendiente, { cascade: true })
  horarios: HorarioPendiente[];

  @Column({nullable: true})
  observaciones: string;

}
