import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReporteVoluntario } from "src/modulos/reporte-voluntario/entities/reporte-voluntario.entity";

@Entity('contacto_emergencia')
export class ContactoEmergencia {

    @PrimaryGeneratedColumn()
       idContacto: number;

    @Column({length: 50})
       contacto: string;

    @Column({length: 15})
       telefono: string;

    @OneToOne(() => ReporteVoluntario, voluntario => voluntario.contactoEmergencia)
  voluntario: ReporteVoluntario;

}