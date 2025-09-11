import { Estado_Proveedor } from "src/common/enums/estadoProveedor.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Factura } from "./factura.entity";
import { Area } from "./area.entity";

@Entity()
export class Proveedor {

   @PrimaryGeneratedColumn()
   id_proveedor: number;

   @Column()
   nombre: string;

   @Column()
   numero: number;

   @Column()
   correo: string;

   @Column()
   direccion: string;

   @Column({type: 'enum', enum: Estado_Proveedor})
   estado: Estado_Proveedor

   @OneToMany(() => Factura, factura => factura.proveedor)
   facturas: Factura[];

   @ManyToOne(() => Area, area => area.proveedores)
   area: Area;
    
}