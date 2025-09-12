import { Estado_Factura } from 'src/common/enums/estadoFactura.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne} from 'typeorm';
import { Proveedor } from './proveedor.entity';


@Entity()
export class Factura {

  @PrimaryGeneratedColumn()
  id_factura: number;

  @Column({nullable: false})
  numero_factura: number; 

  @Column({nullable: false})
  fecha_emitida: Date;

  @Column({nullable: false})
  fecha_pago: Date;

  @Column({nullable: false})
  monto: number;

  @Column({type: 'enum', enum: Estado_Factura, default: Estado_Factura.pendiente})
  estado: Estado_Factura;

  @ManyToOne(() => Proveedor, proveedor => proveedor.facturas)
  proveedor: Proveedor;

}
