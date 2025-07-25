import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { Voluntario } from './voluntariado.entity';
import { Tipo_voluntariado } from './tipoVoluntariado.entity';
import { Horario } from './horario.entity';


@Entity()
export class SolicitudAprobada {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  datosExtra?: string; 

  @CreateDateColumn()
  aprobadaEn: Date;

  @ManyToOne(() => Voluntario, voluntario => voluntario.solicitudesAprobadas)
  @JoinColumn({ name: 'voluntario_id' })
  voluntario: Voluntario;

  @ManyToOne(() => Tipo_voluntariado, tipo => tipo.solicitudes)
  @JoinColumn({ name: 'tipo_voluntariado_id' })
  tipoVoluntariado: Tipo_voluntariado;

  @OneToMany(() => Horario, horario => horario.solicitud, { cascade: true })
  horarios: Horario[];
}
