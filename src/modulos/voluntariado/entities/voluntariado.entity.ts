import { Sexo } from 'src/common/enums/rol.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { SolicitudAprobada } from './solicitudAprobada.entity';
import { Contacto_emergencia } from './contactoEmergencia.entity';


@Entity()
export class Voluntario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: string
  
  @Column()
  nombre: string;
  
  @Column()
  apellido1: string;
  
  @Column({nullable: true})
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

  @CreateDateColumn()
  creadoEn: Date;

  @OneToMany(() => SolicitudAprobada, sa => sa.voluntario)
  solicitudesAprobadas: SolicitudAprobada[];

  @OneToMany(() => Contacto_emergencia, contacto => contacto.voluntario, {
  cascade: true,
  })
  contactosEmergencia: Contacto_emergencia[];

}
