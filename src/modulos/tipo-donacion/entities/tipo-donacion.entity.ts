import { reporteDonacion } from "src/modulos/reporte-donacion/entities/reporte-donacion.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('tipo_donacion')
export class tipoDonacion {

  @PrimaryGeneratedColumn()
  idTipo: number;

  @Column({length: 30})
  tipoDonacion: string;

  @OneToMany (() => reporteDonacion, (reporteDonacion) => reporteDonacion.tipoDonacion)
    reporteDonaciones : reporteDonacion[]
}