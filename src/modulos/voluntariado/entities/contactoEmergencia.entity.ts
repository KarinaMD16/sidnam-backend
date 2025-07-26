import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { Voluntario } from './voluntariado.entity';


@Entity()
export class Contacto_emergencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string; 

  @Column()
  telefono: string;

  @CreateDateColumn()
  aprobadaEn: Date;

  @ManyToOne(() => Voluntario, voluntario => voluntario.contactosEmergencia, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'voluntario_id' })
  voluntario: Voluntario;

}
