import { Medicamentos } from "src/modulos/residentes/entities/medicamento.entity";
import { Unidad_Medida } from "src/modulos/unidades-medida/entities/unidadMedida.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class EntradaMedicamento {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'timestamp'})
    fechaEntrada: Date;

    @Column()
    cantidad: number;

    @ManyToOne(() => Unidad_Medida, unidad_medida => unidad_medida.entradasMedicamento)
    @JoinColumn({ name: 'unidad_medida_id' })
    unidad_medida: Unidad_Medida;


    @ManyToOne(() => Medicamentos, medicamento => medicamento.entradasMedicamento)
    @JoinColumn({ name: 'medicamento_id' })
    medicamento: Medicamentos;


}