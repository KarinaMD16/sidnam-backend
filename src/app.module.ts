import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicacionesModule } from './modulos/publicaciones/publicaciones.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donacion } from './modulos/publicaciones/entities/donacion.entity';
import { Eventos } from './modulos/publicaciones/entities/eventos.entity';
import { Proyectos } from './modulos/publicaciones/entities/proyectos.entity';
import { GaleriaModule } from './modulos/galeria/galeria.module';
import { Galeria } from './modulos/galeria/entities/galeria.entity';
import { Categoria } from './modulos/galeria/entities/categoria.entity';
import { GestionUsuarioModule } from './modulos/gestion-usuario/gestion-usuario.module';
import { Usuario } from './modulos/gestion-usuario/entities/usuario.entity';
import { AutenticacionModule } from './modulos/autenticacion/autenticacion.module';
import { ConfigModule } from '@nestjs/config';
import { reporteDonacion } from './modulos/reporte-donacion/entities/reporte-donacion.entity';
import { reporteDonacionModule } from './modulos/reporte-donacion/reporte-donacion.module';
import { tipoDonacion } from './modulos/tipo-donacion/entities/tipo-donacion.entity';
import { tipoDonacionModule } from './modulos/tipo-donacion/tipo-donacion.module';
import { ReporteVoluntario } from './modulos/reporte-voluntario/entities/reporte-voluntario.entity';
import { reporteVoluntarioModule } from './modulos/reporte-voluntario/reporte-voluntario.module';
import { tipoVoluntarioModule } from './modulos/tipo-voluntario/tipo-voluntario.module';
import { tipoVoluntario } from './modulos/tipo-voluntario/entities/tipo-voluntario.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    PublicacionesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Adbf101123',
      database: 'SIDNAMDB',
      entities: [Donacion, Eventos, Proyectos, Galeria, Categoria, Usuario, reporteDonacion, tipoDonacion, ReporteVoluntario, tipoVoluntario,],
      synchronize: true,
      dropSchema: true,

    }),
    GaleriaModule,
    GestionUsuarioModule,
    AutenticacionModule,
    reporteDonacionModule,
    tipoDonacionModule,
    reporteVoluntarioModule,
    tipoVoluntarioModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
