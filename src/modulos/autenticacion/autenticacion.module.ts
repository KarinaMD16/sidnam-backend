import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';
import { GestionUsuarioModule } from '../gestion-usuario/gestion-usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwt.constant';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    GestionUsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  providers: [AutenticacionService, EmailService],
  controllers: [AutenticacionController]
})
export class AutenticacionModule {}
