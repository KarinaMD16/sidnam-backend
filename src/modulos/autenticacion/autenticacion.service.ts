import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { GestionUsuarioService } from '../gestion-usuario/gestion-usuario.service';
import { RegisterDto } from './dto/registerDto';
import * as bcryptjs from 'bcryptjs';
import { Rol } from 'src/common/enums/rol.enum';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AutenticacionService {

    constructor(
        private readonly gestionUsuarios: GestionUsuarioService,
        private readonly jwtService: JwtService
    ){}

    async crearUsuarioAdministrador({cedula, email, password}: RegisterDto){

        const usuario = await this.gestionUsuarios.findOneByEmail(cedula);

        if(usuario){
            throw new BadRequestException("La cedula ya se encuentra registrada");
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        await this.gestionUsuarios.createUsuarioAdministrador({
            cedula,
            email,
            password: hashedPassword,
            role: Rol.ADMIN
        });

        return {
            message: "Usuario creado con exito",
        };
    }

    async login({cedula, password}: LoginDto){
        const user = await this.gestionUsuarios.findOneByEmail(cedula);

        if(!user){
            throw new UnauthorizedException("Cedula invalida");
        }

        const isPassawordValid = await bcryptjs.compare(password, user.password);

        if(!isPassawordValid){
            throw new UnauthorizedException("Contraseña invalida");
        }

        const payload = { id: user.id, email: user.email, role: user.role};

        const token = await this.jwtService.signAsync(payload);

        return{
            token: token,
        };
    }
}
