import { Column, DeleteDateColumn, Entity } from "typeorm";

@Entity()
export class Usuario {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ length: 500 })
  cedula: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: "user" })
  role: string;

  @DeleteDateColumn()
  deletedAt: Date;
}