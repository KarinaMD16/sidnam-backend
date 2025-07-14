import { Module } from '@nestjs/common';
import { TipoDonacionService } from './tipo-donacion.service';
import { TipoDonacionController } from './tipo-donacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tipoDonacion } from './entities/tipo-donacion.entity';


@Module({
  imports: [TypeOrmModule.forFeature([tipoDonacion])],
  controllers: [TipoDonacionController],
  providers: [TipoDonacionService],
  exports: [TipoDonacionService],
})
export class tipoDonacionModule {}

