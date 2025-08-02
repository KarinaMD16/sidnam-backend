import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RegistroDonacion } from "./registroDonacion.entity";


@Entity()
export class Tipo_donacion {
    
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   nombre: string; 

   @OneToMany(() => RegistroDonacion, solicitud => solicitud.tipoDonacion)
     solicitudes: RegistroDonacion[];
  
}