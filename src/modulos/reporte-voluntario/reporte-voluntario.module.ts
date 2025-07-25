import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReporteVoluntarioService } from "./reporte-voluntario.service";
import { ReporteVoluntarioController } from "./reporte-voluntario.controller";
import { ReporteVoluntario } from "./entities/reporte-voluntario.entity";
import { tipoVoluntario } from "../tipo-voluntario/entities/tipo-voluntario.entity";



@Module({
  imports: [TypeOrmModule.forFeature([ReporteVoluntario, tipoVoluntario])],
  controllers: [ReporteVoluntarioController],
  providers: [ReporteVoluntarioService],
  exports: [ReporteVoluntarioService],
})
export class reporteVoluntarioModule {}

