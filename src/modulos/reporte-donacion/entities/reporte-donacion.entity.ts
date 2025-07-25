import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EstadoSolicitudes} from 'src/common/enums/estado-solicitudes.enum';
import { tipoDonacion } from 'src/modulos/tipo-donacion/entities/tipo-donacion.entity';

@Entity('reporte_donacion')
export class reporteDonacion {

  @PrimaryGeneratedColumn()
  idReporte: number;

  @Column({length: 100})
  nombre: string;

  @Column({length: 50})
  apellido: string;

  @Column({length: 50, nullable: true})
  segundoApellido: string;

  @Column({length: 25})
  cedula: string;

  @Column({length: 75, nullable: true})
  correo: string;

  @Column({length: 15})
  telefono: string;

  @Column({type: 'enum', enum: EstadoSolicitudes, default: EstadoSolicitudes.PENDIENTE})
  estadoDonacion: EstadoSolicitudes;

  @Column({length: 500, nullable: true})
  descripcion: string;    

  @Column({nullable: true})
  monto: number;

  @Column({ nullable: true})
  fechaDonacion: Date;

  @Column({length: 100, nullable: true})
  observaciones: string;

  @ManyToOne(()=> tipoDonacion, (tipoDonacion)=> tipoDonacion.reporteDonaciones)
    @JoinColumn({ name: 'idTipo' })
    tipoDonacion: tipoDonacion
}