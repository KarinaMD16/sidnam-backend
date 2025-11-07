import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Password_Edus {

   @PrimaryGeneratedColumn()
   id_password: number;

   @Column({ type: 'varchar'})
   password: string;

}
