import { Estado_Area } from "src/common/enums/estadoArea.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Proveedor } from "./proveedor.entity";

@Entity()
export class Area {

   @PrimaryGeneratedColumn()
   id_area: number;

   @Column({ nullable: false })
   nombre: string;

   @Column({ type: 'enum', enum: Estado_Area, default: Estado_Area.activo})
   estado: Estado_Area;

   @OneToMany(() => Proveedor, proveedor => proveedor.area)
   proveedores: Proveedor[];
}