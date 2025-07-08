import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';
import { GestionUsuarioModule } from '../gestion-usuario/gestion-usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwt.constant';

@Module({
  imports: [
    GestionUsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  providers: [AutenticacionService],
  controllers: [AutenticacionController]
})
export class AutenticacionModule {}
