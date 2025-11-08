import { BadRequestException, Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Resend } from 'resend';
import { GestionUsuarioService } from 'src/modulos/gestion-usuario/services/gestion-usuario.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor(
  private readonly configService: ConfigService,
  private readonly gestionUsuarios: GestionUsuarioService,
  private readonly jwtService: JwtService,
) {
  const apiKey = this.configService.get<string>('RESEND_API_KEY');
  this.logger.log(`🔑 Resend API Key (inicio): ${apiKey ? apiKey.slice(0, 10) + '...' : 'NO ENCONTRADA'}`);
  if (!apiKey) {
    throw new Error('❌ RESEND_API_KEY no está configurada en las variables de entorno');
  }
  this.resend = new Resend(apiKey);
}


  private async sendMail(to: string, subject: string, html: string) {
    const from = this.configService.get<string>('EMAIL_FROM');
    if (!from) {
      this.logger.error('EMAIL_FROM no está configurado en las variables de entorno');
      throw new InternalServerErrorException('Error al enviar correo.');
    }

    try {
      await this.resend.emails.send({
        from,      // ahora TypeScript sabe que es string, no string | undefined
        to,
        subject,
        html,
      });
      this.logger.log(`✅ Email enviado correctamente a ${to}`);
    } catch (error: any) {
      this.logger.error(`❌ Error al enviar correo a ${to}: ${error?.message ?? error}`);
      throw new BadRequestException('No se pudo enviar el correo.');
    }
  }

  // 🔐 Enlace de restablecimiento de contraseña
  public async sendResetPasswordLink(email: string): Promise<void> {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME'),
    });

    const user = await this.gestionUsuarios.findOneByEmail(email);
    if (!user) throw new NotFoundException('Email no existente');

    const url = `${this.configService.get<string>('EMAIL_RESET_PASSWORD_URL')}?token=${token}`;

    const html = `
      <div style="font-family: 'Poppins', Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border-radius: 20px; border: 1px solid #ddd;">
        <h2 style="color: #8F1047;">Restablece tu contraseña</h2>
        <p>Hola ${user.cedula || ''},</p>
        <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
        <p style="text-align:center;">
          <a href="${url}" style="background-color:#8F1047;color:white;padding:10px 20px;border-radius:32px;text-decoration:none;">
            Restablecer contraseña
          </a>
        </p>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
      </div>
    `;

    await this.sendMail(email, 'Restablecer tu contraseña', html);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_VERIFICATION_TOKEN_SECRET'),
      });
      if (typeof payload === 'object' && 'email' in payload) return (payload as any).email;
      throw new BadRequestException('Token inválido');
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('El token ha expirado');
      }
      throw new BadRequestException('Token inválido');
    }
  }

  // 📨 Solicitudes de voluntariado
  public async sendSolicitudAceptadaEmail(email: string, nombre: string): Promise<void> {
    const html = `
      <div style="font-family: 'Poppins', Arial, sans-serif; margin: auto; padding: 20px;">
        <h2 style="color: #22c55e;">¡Tu solicitud de voluntariado ha sido aceptada!</h2>
        <p>Hola ${nombre},</p>
        <p>Nos complace informarte que tu solicitud fue <strong>aprobada</strong>.</p>
        <p>Las actividades se asignarán en las instalaciones. ¡Gracias por unirte!</p>
      </div>
    `;
    await this.sendMail(email, 'Solicitud de voluntariado aceptada', html);
  }

  public async sendSolicitudRechazadaEmail(email: string, nombre: string): Promise<void> {
    const html = `
      <div style="font-family: 'Poppins', Arial, sans-serif; margin: auto; padding: 20px;">
        <h2 style="color: #c52238;">Tu solicitud fue rechazada</h2>
        <p>Hola ${nombre},</p>
        <p>Lamentamos informarte que tu solicitud de voluntariado fue <strong>rechazada</strong>.</p>
        <p>Agradecemos tu interés en apoyar nuestra causa y esperamos poder contar contigo en el futuro.</p>
      </div>
    `;
    await this.sendMail(email, 'Solicitud de voluntariado rechazada', html);
  }

  // 💰 Solicitudes de donación
  public async sendSolicitudDonacionAceptadaEmail(email: string, nombre: string): Promise<void> {
    const html = `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 20px; border: 1px solid #ddd;">
        <h2 style="color: #22c55e;">¡Tu solicitud de donación ha sido aceptada!</h2>
        <p>Hola ${nombre},</p>
        <p>Gracias por tu generosidad. Pronto te contactaremos para coordinar la entrega.</p>
      </div>
    `;
    await this.sendMail(email, 'Solicitud de donación aceptada', html);
  }

  public async sendSolicitudDonacionRechazadaEmail(email: string, nombre: string): Promise<void> {
    const html = `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 20px; border: 1px solid #ddd;">
        <h2 style="color: #c52238;">Tu solicitud de donación fue rechazada</h2>
        <p>Hola ${nombre},</p>
        <p>Lamentamos informarte que tu solicitud fue <strong>rechazada</strong>. Agradecemos tu intención y esperamos colaborar contigo en el futuro.</p>
      </div>
    `;
    await this.sendMail(email, 'Solicitud de donación rechazada', html);
  }
}
