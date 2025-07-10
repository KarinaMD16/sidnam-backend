import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Rol } from 'src/common/enums/rol.enum';
import { RolesGuard } from './guard/roles.guard';

@Controller('autenticacion')
export class AutenticacionController {

    constructor(private readonly authService: AutenticacionService){}

    
    @Post("register/:rol")
    @Roles(Rol.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    registerAdministrador(@Body() registerDto: RegisterDto, @Param('rol') rol: string){
        return this.authService.crearUsuario(registerDto, rol.toUpperCase());
    }   

    @HttpCode(HttpStatus.OK)
    @Post('Login')
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }
    
}
