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
        <div style="font-family: 'Poppins', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 24px;">
            <h2 style="color: #E52B50;">Restablece tu contraseña</h2>

            <p style="font-size: 16px;">Hola ${user.cedula || ''},</p>

            <p style="font-size: 16px; line-height: 1.5;">
            Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón a continuación para continuar:
            </p>

            <p style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="
                background-color: #8F1047;
                color: white;
                padding: 10px 20px;
                font-size: 16px;
                font-family: 'Poppins', Arial, sans-serif;
                font-weight: 500;
                border-radius: 32px;
                text-decoration: none;
                display: inline-block;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                white-space: nowrap;
                max-width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
            ">
                Restablecer contraseña
            </a>
            </p>

            <p style="font-size: 14px; color: #555;">
            Si no solicitaste este cambio, puedes ignorar este mensaje. Tu contraseña permanecerá segura.
            </p>

            <hr style="margin: 30px 0;">

            <p style="font-size: 12px; color: #999; text-align: center;">
            Este enlace caduca en 3 horas.
            </p>
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

    public async sendSolicitudAceptadaEmail(email: string, nombre: string): Promise<void> {
        const html = `
            <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 20px; border: 1px solid #ddd;">
            <h2 style="color: #22c55e;">¡Tu solicitud ha sido aceptada!</h2>
            <p>Hola ${nombre},</p>
            <p>Nos complace informarte que tu solicitud de voluntariado ha sido <strong>aprobada</strong>.</p>
            <p>Las actividades se asignarán en las instalaciones.</p>
            <p style="margin-top: 30px;">¡Gracias por unirte a nuestra comunidad de voluntariado!</p>
            </div>
        `;

        await this.sendMail({
            to: email,
            subject: 'Solicitud de voluntariado aceptada',
            html,
        });
    }

    public async sendSolicitudRechazadaEmail(email: string, nombre: string): Promise<void> {
    const html = `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 20px; border: 1px solid #ddd;">
            <h2 style="color: #c52238;">Tu solicitud ha sido rechazada</h2>
            <p>Hola ${nombre},</p>
            <p>Lamentamos informarte que tu solicitud de voluntariado ha sido <strong>rechazada</strong> tras una revisión del equipo correspondiente.</p>
            <p>Agradecemos sinceramente tu interés en formar parte de nuestra comunidad.</p>
            <p style="margin-top: 30px;">Puedes volver a intentarlo en el futuro o seguir apoyando en otras formas.</p>
        </div>
    `;

    await this.sendMail({
        to: email,
        subject: 'Solicitud de voluntariado rechazada',
        html,
    });
}


    public async sendSolicitudDonacionAceptadaEmail(email: string, nombre: string): Promise<void> {
        const html = `
            <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 20px; border: 1px solid #ddd;">
            <h2 style="color: #22c55e;">¡Tu solicitud de donación ha sido aceptada!</h2>
            <p>Hola ${nombre},</p>
            <p>Nos complace informarte que tu solicitud de donación ha sido <strong>aceptada</strong>.</p>
            <p>Nos estaremos contactando pronto contigo para coordinar la entrega.</p>
            <p style="margin-top: 30px;">¡Gracias por tu generosidad y por contribuir a nuestra causa!</p>
            </div>
        `;

        await this.sendMail({
            to: email,
            subject: 'Solicitud de donación aceptada',
            html,
       });
    }



    public async sendSolicitudDonacionRechazadaEmail(email: string, nombre: string): Promise<void> {
        const html = `
            <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 20px; border: 1px solid #ddd;">
            <h2 style="color: #c52238;">Tu solicitud de donación ha sido rechazada</h2>
            <p>Hola ${nombre},</p>
            <p>Lamentamos informarte que tu solicitud de donación ha sido <strong>rechazada</strong> tras una revisión del equipo correspondiente.</p>
            <p>Si tienes alguna del porque tu solicitud fue rechazada, puedes contactarte con nosotros y te daremos más información.</p>
            <p style="margin-top: 30px;">Agradecemos sinceramente tu interés en ayudar y contribuir a nuestra causa, esperamos la posibilidad de tu colaboración en un futuro.</p>
            </div>
        `;

        await this.sendMail({
            to: email,
            subject: 'Solicitud de donación rechazada',
            html,
       });
    }


}
