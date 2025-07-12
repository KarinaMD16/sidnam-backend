    import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
    } from '@nestjs/common';
    import { ConfigService } from '@nestjs/config';
    import { JwtService } from '@nestjs/jwt';
    import { createTransport } from 'nodemailer';
    import * as nodemailer from 'nodemailer';
    import Mail from 'nodemailer/lib/mailer';
    import { GestionUsuarioService } from 'src/modulos/gestion-usuario/gestion-usuario.service';

    @Injectable()
    export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private nodemailerTransport: nodemailer.Transporter;

    constructor(
        private readonly configService: ConfigService,
        private readonly gestionUsuarios: GestionUsuarioService,
        private readonly jwtService: JwtService,
    ) {
        this.nodemailerTransport = createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: this.configService.get<string>('EMAIL_USER'),
            pass: this.configService.get<string>('EMAIL_PASSWORD'),
        },
        });
    }

    public async sendResetPasswordLink(email: string): Promise<void> {
        const payload = { email };

        const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_VERIFICATION_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME'),
        });

        const user = await this.gestionUsuarios.findOneByEmail(email);
        if (!user) {
        throw new NotFoundException('Email no existente');
        }

        const url = `${this.configService.get<string>('EMAIL_RESET_PASSWORD_URL')}?token=${token}`;

        const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Reestablece tu contraseña</h2>
        <p>Hola ${user.cedula || ''},</p>
        <p>Hemos recibido una solicitud para reestablecer tu contraseña. Haz click acá para proceder:</p>
        <p>
        <a href="${url}" style="
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
        ">
            Reestablecer contraseña
        </a>
        </p>

        <p>Si no hiciste esta solicitud puedes ignorarla</p>
        <hr>
        <small>Este link será inválido dentro de tres horas</small>
    </div>
    `;

        return this.sendMail({
        to: email,
        subject: 'Reset your password',
        html,
        });
    }

    private sendMail(options: Mail.Options) {
        this.logger.log(`Email sent out to ${options.to}`);
        return this.nodemailerTransport.sendMail(options);
    }

    public async decodeConfirmationToken(token: string) {
        try {
        const payload = await this.jwtService.verify(token, {
            secret: this.configService.get<string>('JWT_VERIFICATION_TOKEN_SECRET'),
        });

        if (typeof payload === 'object' && 'email' in payload) {
            return payload.email;
        }
        throw new BadRequestException();
        } catch (error) {
        if (error?.name === 'TokenExpiredError') {
            throw new BadRequestException('Email confirmation token expired');
        }
        throw new BadRequestException('Bad confirmation token');
        }
    }
    }
