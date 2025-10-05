import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolUsuario } from "./rol.entity";
import { Estado_Usuario } from "src/common/enums/esatadoUsuario.enum";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  cedula: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: false })
  apellido1: string;

  @Column({ nullable: true })
  apellido2: string;

  @Column({ nullable: false })
  password: string;

  @ManyToOne(() => RolUsuario, { nullable: false })
  rol: RolUsuario;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  @Column({ type: 'enum', enum: Estado_Usuario, default: Estado_Usuario.activo })
  estado: Estado_Usuario

  @Column({ nullable: true })
  imagenUrl: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
}