import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GestionUsuarioService } from '../gestion-usuario/gestion-usuario.service';
import { RegisterDto } from './dto/registerDto';
import * as bcryptjs from 'bcryptjs';
import { Rol } from 'src/common/enums/rol.enum';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email/email.service';




@Injectable()
export class AutenticacionService {

    constructor(
        private readonly gestionUsuarios: GestionUsuarioService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService
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

    async forgotPassword(email: string): Promise<{ message: string }> {
        const user = await this.gestionUsuarios.findOneByEmail(email);
        
        if (user?.email?.trim()) {
            await this.emailService.sendResetPasswordLink(user.email.trim());
        }

        return {
            message: 'Si este correo está vinculado a una cuenta, podrás restablecer tu contraseña.'
        };
    }


    async resetPassword(token: string, password: string): Promise<void> {
        const email = await this.emailService.decodeConfirmationToken(token);

        const user = await this.gestionUsuarios.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`);
        }

         const hashedPassword = await bcryptjs.hash(password, 10);

         await this.gestionUsuarios.updateUsuario(email, hashedPassword)
        
    }
}
