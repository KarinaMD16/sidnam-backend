import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';
import { Response } from 'express';
import { AuthGuard } from './guard/auth.guard';



@Controller('autenticacion')
export class AutenticacionController {

    constructor(private readonly authService: AutenticacionService){}


    @UseGuards(AuthGuard)
    @Post("register")
    registerAdministrador(@Body() registerDto: RegisterDto){
        return this.authService.crearUsuario(registerDto);
    }   

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto) {
        const { accessToken, refreshToken, id } = await this.authService.login(loginDto);

        res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        return { accessToken, id };
    }

    @UseGuards(AuthGuard)
    @Post('refresh')
        async refresh(@Req() req: Request & { cookies: { [key: string]: string } }, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        return this.authService.refresh(refreshToken, res);
    }

    @UseGuards(AuthGuard)
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

    @UseGuards(AuthGuard)
    @Get('me')
    async getMe(
    @Req() req: Request & { cookies: { [key: string]: string } }    ) {
    const token = req.cookies['refresh_token'];
    if (!token) throw new UnauthorizedException('Token no encontrado en cookies');

    return this.authService.getUserWithPermissions(token);
    }

}
