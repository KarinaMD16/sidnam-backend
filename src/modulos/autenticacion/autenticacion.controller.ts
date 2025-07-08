import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';

@Controller('autenticacion')
export class AutenticacionController {

    constructor(private readonly authService: AutenticacionService){}

    @Post("register")
    register(@Body() registerDto: RegisterDto){
        return this.authService.crearUsuarioAdministrador(registerDto);
    }   

    @HttpCode(HttpStatus.OK)
    @Post('Login')
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }
    
}
