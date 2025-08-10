import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Rol } from 'src/common/enums/rol.enum';
import { RolesGuard } from './guard/roles.guard';
import { Response } from 'express';


@Controller('autenticacion')
export class AutenticacionController {

    constructor(private readonly authService: AutenticacionService){}

    
    @Post("register/:rol")
    registerAdministrador(@Body() registerDto: RegisterDto, @Param('rol') rol: string){
        return this.authService.crearUsuario(registerDto, rol.toUpperCase());
    }   

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto) {
        const { accessToken, refreshToken, id } = await this.authService.login(loginDto);

        res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        return { accessToken, id };
    }

    @Post('refresh')
        async refresh(@Req() req: Request & { cookies: { [key: string]: string } }, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        return this.authService.refresh(refreshToken, res);
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        
        const refreshToken = (req as any).cookies['refresh_token'];

        if (refreshToken) {
        try {
            const payload = await this.authService['jwtService'].verifyAsync(refreshToken);
            await this.authService.logout(payload.id);
        } catch {
            
        }
        }
        res.clearCookie('refresh_token', { httpOnly: true, secure: true, sameSite: 'strict' });
        return { message: 'Sesión cerrada' };
    }
    
    @Post('forgot-password')
    @HttpCode(200)
        async forgotPassword(@Body() { email }: { email: string }): Promise<{ message: string }>  {
        return this.authService.forgotPassword(email);
    }

    @Post('reset-password')
        async resetPassword(
        @Body() body: { token: string; password: string }
        ): Promise<void> {
        return this.authService.resetPassword(body.token, body.password);
    }

}
