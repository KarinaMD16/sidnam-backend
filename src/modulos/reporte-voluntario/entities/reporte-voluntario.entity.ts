import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { tipoVoluntario } from "src/modulos/tipo-voluntario/entities/tipo-voluntario.entity";
import { EstadoSolicitudes } from "src/common/enums/estado-solicitudes.enum";

@Entity('reporte_voluntario')
export class ReporteVoluntario {

    @PrimaryGeneratedColumn()
      idVoluntario: number;

    @Column({length: 100})
      nombre: string;
    
    @Column({length: 50})
      apellido: string;
    
    @Column({length: 50, nullable: true})
      segundoApellido: string;

    @Column({length: 25, unique: true})
      cedula: string;

    @Column ({length: 20})
      sexo: string;

    @Column({length: 50})
      ocupacion: string;

    @Column({length: 15})
      telefono: string;

    @Column({length: 75, nullable: true})
      correo: string;

    @Column({length: 150})
       direccion: string;

    @Column({length: 500, nullable: true})
       descripcion: string;

    @Column({length: 15})
       dia: string;

    @Column({ type: 'time' })
       horaInicio: string;

    @Column({ type: 'time' })
       horaFin: string;

    @Column({length: 20, nullable: true})
       contactoEmergencia: string;
       
    @Column({length: 500, nullable: true})
       experiencia: string;    

    @Column({length: 500})
       observaciones: string;   

       @Column({type: 'enum', enum: EstadoSolicitudes, default: EstadoSolicitudes.PENDIENTE})
         estadoVoluntario: EstadoSolicitudes;

  
    @ManyToOne(()=> tipoVoluntario, (tipoVoluntario)=> tipoVoluntario.reporteVoluntarios)
        @JoinColumn({ name: 'idTipoVoluntario' })
        tipoVoluntario: tipoVoluntario
     
}