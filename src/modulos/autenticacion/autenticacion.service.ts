import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { GestionUsuarioService } from '../gestion-usuario/gestion-usuario.service';
import { RegisterDto } from './dto/registerDto';
import * as bcryptjs from 'bcryptjs';
import { Rol } from 'src/common/enums/rol.enum';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';


@Injectable()
export class AutenticacionService {

    constructor(
        private readonly gestionUsuarios: GestionUsuarioService,
        private readonly jwtService: JwtService
    ){}

    async crearUsuario({cedula, email, password}: RegisterDto, rol: string){

        const rolValido = Object.values(Rol).includes(rol as Rol);
        if (!rolValido) {
            throw new BadRequestException("Rol inválido");
        }

        const usuario = await this.gestionUsuarios.findOneByCedula(cedula);

        if(usuario){
            throw new BadRequestException("La cedula ya se encuentra registrada");
        }

        const correo  = await this.gestionUsuarios.findOneByEmail(email);

        if(correo){
            throw new BadRequestException("El correo ya se encuentra registrado");
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        await this.gestionUsuarios.createUsuario({
            cedula,
            email,
            password: hashedPassword,
            role: rol as Rol
        });

        return {
            message: "Usuario creado con exito",
        };
    }

    async login({cedula, password}: LoginDto){
        const user = await this.gestionUsuarios.findOneByCedula(cedula);

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
            id: user.id
        };
    }
}
