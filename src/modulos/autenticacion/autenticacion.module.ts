import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';
import { GestionUsuarioModule } from '../gestion-usuario/gestion-usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwt.constant';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../gestion-usuario/entities/usuario.entity';
import { RolUsuario } from '../gestion-usuario/entities/rol.entity';

@Module({
  imports: [
    ConfigModule,
    GestionUsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1d" },
    }),
    TypeOrmModule.forFeature([Usuario, RolUsuario])
  ],
  providers: [AutenticacionService, EmailService],
  controllers: [AutenticacionController],
  exports: [EmailService]
})
export class AutenticacionModule {}
