import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donacion } from './publicaciones/entities/donacion.entity';
import { Eventos } from './publicaciones/entities/eventos.entity';
import { Proyectos } from './publicaciones/entities/proyectos.entity';

@Module({
  imports: [
    PublicacionesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'SIDNAMDB',
      entities: [Donacion, Eventos, Proyectos],
      synchronize: false,
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
