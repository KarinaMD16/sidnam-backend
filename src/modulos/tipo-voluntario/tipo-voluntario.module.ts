import { Module } from '@nestjs/common';
import { TipoVoluntarioService } from './tipo-voluntario.service';
import { TipoVoluntarioController } from './tipo-voluntario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tipoVoluntario } from './entities/tipo-voluntario.entity';


@Module({
  imports: [TypeOrmModule.forFeature([tipoVoluntario])],
  controllers: [TipoVoluntarioController],
  providers: [TipoVoluntarioService],
  exports: [TipoVoluntarioService],
})
export class tipoVoluntarioModule {}

