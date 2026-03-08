import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';
import { Request, Response } from 'express';
import { AuthGuard } from './guard/auth.guard';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly authService: AutenticacionService) {}

  @UseGuards(AuthGuard)
  @Post('register')
  registerAdministrador(@Body() registerDto: RegisterDto) {
    return this.authService.crearUsuario(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const { accessToken, refreshToken, id } =
      await this.authService.login(loginDto);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none' as const,
      path: '/',
    };

    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { id };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['refresh_token'];
    return this.authService.refresh(refreshToken, res);
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['refresh_token'];

    if (refreshToken) {
      try {
        const payload = await this.authService.verifyToken(refreshToken);
        await this.authService.logout(payload.id);
      } catch {}
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none' as const,
      path: '/',
    };

    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);

    return { message: 'Sesión cerrada' };
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(
    @Body() { email }: { email: string },
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; password: string },
  ): Promise<void> {
    return this.authService.resetPassword(body.token, body.password);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const token = req.cookies?.['access_token'];
    return this.authService.getUserWithPermissions(token!);
  }
}