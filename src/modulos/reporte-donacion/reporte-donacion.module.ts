import { Module } from '@nestjs/common';
import { ReporteDonacionService } from './reporte-donacion.service';
import { ReporteDonacionController } from './reporte-donacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { reporteDonacion } from './entities/reporte-donacion.entity';
import { tipoDonacion } from '../tipo-donacion/entities/tipo-donacion.entity';


@Module({
  imports: [TypeOrmModule.forFeature([reporteDonacion, tipoDonacion])],
  controllers: [ReporteDonacionController],
  providers: [ReporteDonacionService],
  exports: [ReporteDonacionService],
})
export class reporteDonacionModule {}

