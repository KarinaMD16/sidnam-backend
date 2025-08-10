import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
  password: string;

  @Column({ default: "user" })
  role: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  @DeleteDateColumn()
  deletedAt: Date;
}