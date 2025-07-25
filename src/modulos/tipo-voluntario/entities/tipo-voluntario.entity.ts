import { ReporteVoluntario } from "src/modulos/reporte-voluntario/entities/reporte-voluntario.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('tipo_voluntario')
export class tipoVoluntario {

  @PrimaryGeneratedColumn()
  idTipoVoluntario: number;
  

  @Column({length: 30, unique: true})
  tipoVoluntario: string;


  @OneToMany (() => ReporteVoluntario, (reporteVoluntario) => reporteVoluntario.tipoVoluntario)
    reporteVoluntarios : ReporteVoluntario[]
}