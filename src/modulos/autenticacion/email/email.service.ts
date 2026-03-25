import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Resend } from 'resend';
import { GestionUsuarioService } from 'src/modulos/gestion-usuario/services/gestion-usuario.service';
import * as fs from 'fs';
import * as path from 'path';

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
    this.logger.log(
      `🔑 RESEND_API_KEY leída en runtime: ${
        apiKey ? apiKey.slice(0, 10) + '...' : 'NO ENCONTRADA'
      }`,
    );

    if (!apiKey) {
      throw new Error('RESEND_API_KEY no está configurada en las variables de entorno');
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
      const { data, error } = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error(
          `❌ Error de Resend al enviar a ${to}: ${JSON.stringify(error)}`,
        );
        throw new BadRequestException('No se pudo enviar el correo (Resend).');
      }

      this.logger.log(
        `✅ Email enviado correctamente a ${to}. Resend ID: ${data?.id}`,
      );
    } catch (error: any) {
      this.logger.error(
        `❌ Error inesperado al enviar correo a ${to}:`,
        error,
      );
      throw new BadRequestException('No se pudo enviar el correo.');
    }
  }

  private getLogoBase64(): string {
    try {
      const logoPath = path.join(process.cwd(), 'assets', 'hogar-san-blas.png');
      const logoBuffer = fs.readFileSync(logoPath);
      return `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (error) {
      this.logger.error('No se pudo cargar el logo del correo desde assets.', error);
      return '';
    }
  }

  private buildInstitutionalTemplate(params: {
  nombre: string;
  titulo: string;
  subtitulo: string;
  mensajePrincipal: string;
  mensajeSecundario?: string;
  tipoProceso: 'Voluntariado' | 'Donación';
  estado: 'Aceptada' | 'Rechazada';
  colorEstado: string;
}): string {
  const {
    nombre,
    titulo,
    subtitulo,
    mensajePrincipal,
    mensajeSecundario,
    tipoProceso,
    estado,
    colorEstado,
  } = params;

  const logoBase64 = this.getLogoBase64();

  return `
    <div style="margin:0; padding:0; background-color:#FDF6F9; font-family: 'Segoe UI', Arial, sans-serif; color:#1A1924;">
      
      <!-- Header -->
      <div style="background-color:#A7074D; padding:40px 20px; text-align:center;">
        ${
          logoBase64
            ? `<img src="${logoBase64}" alt="Logo Hogar San Blas" style="width:80px; margin-bottom:20px;" />`
            : `<h2 style="color:#DBBA6B; margin:0;">Hogar de Ancianos San Blas</h2>`
        }
        <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:600;">${titulo}</h1>
        <p style="margin:6px 0 0 0; font-size:14px; color:#DBBA6B;">${subtitulo}</p>
      </div>

      <!-- Body -->
      <div style="max-width:640px; margin:40px auto; padding:32px; background-color:#ffffff; border-radius:20px; box-shadow:0 6px 20px rgba(0,0,0,0.08);">
        
        <p style="font-size:16px; margin-bottom:24px;">Estimado(a) <strong>${nombre}</strong>,</p>

        <!-- Estado -->
        <div style="padding:20px; border:1px solid ${colorEstado}; border-radius:12px; background:#FDF6F9; margin-bottom:24px;">
          <p style="margin:0; font-size:15px;"><strong>Estado:</strong> <span style="color:${colorEstado}; font-weight:bold;">${estado}</span></p>
          <p style="margin:8px 0 0 0; font-size:15px;"><strong>Proceso:</strong> ${tipoProceso}</p>
        </div>

        <!-- Mensaje principal -->
        <p style="font-size:15px; line-height:1.6; margin-bottom:20px;">${mensajePrincipal}</p>

        <!-- Mensaje secundario -->
        ${
          mensajeSecundario
            ? `<p style="font-size:15px; line-height:1.6; color:#444; margin-bottom:20px;">${mensajeSecundario}</p>`
            : ''
        }

        <!-- Nota institucional -->
        <div style="padding:18px; background:#FFF8E8; border:1px solid #DBBA6B; border-radius:12px; margin-top:24px;">
          <p style="margin:0; font-size:14px; color:#1A1924;">
            Este mensaje ha sido emitido por el <strong>Hogar de Ancianos San Blas</strong> como parte del seguimiento institucional.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color:#1A1924; padding:20px; text-align:center;">
        <p style="margin:0; font-size:12px; color:#ffffff;">
          © Hogar de Ancianos San Blas - Correo generado automáticamente.
        </p>
      </div>
    </div>
  `;
}




  // 🔐 Enlace de restablecimiento de contraseña
  public async sendResetPasswordLink(email: string): Promise<void> {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      ),
    });

    const user = await this.gestionUsuarios.findOneByEmail(email);
    if (!user) throw new NotFoundException('Email no existente');

    const url = `${this.configService.get<string>(
      'EMAIL_RESET_PASSWORD_URL',
    )}?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border-radius: 20px; border: 1px solid #ddd;">
        <h2 style="color: #8F1047;">Restablece tu contraseña</h2>
        <p>Hola ${user.name || ''},</p>
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
        secret: this.configService.get<string>(
          'JWT_VERIFICATION_TOKEN_SECRET',
        ),
      });
      if (typeof payload === 'object' && 'email' in payload)
        return (payload as any).email;
      throw new BadRequestException('Token inválido');
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('El token ha expirado');
      }
      throw new BadRequestException('Token inválido');
    }
  }

  // 📨 Solicitudes de voluntariado
  public async sendSolicitudAceptadaEmail(
    email: string,
    nombre: string,
  ): Promise<void> {
    const html = this.buildInstitutionalTemplate({
      nombre,
      titulo: 'Solicitud de voluntariado aceptada',
      subtitulo: 'Notificación oficial del Hogar de Ancianos San Blas',
      mensajePrincipal:
        'Nos complace informarle que su solicitud de voluntariado ha sido aprobada exitosamente. Agradecemos profundamente su disposición para colaborar con nuestra institución y aportar su tiempo en beneficio de nuestros adultos mayores.',
      mensajeSecundario:
        'La asignación de actividades y el seguimiento correspondiente se coordinarán directamente en las instalaciones del Hogar, según las necesidades institucionales y la disponibilidad definida.',
      tipoProceso: 'Voluntariado',
      estado: 'Aceptada',
      colorEstado: '#2e8b57',
    });

    await this.sendMail(
      email,
      'Hogar de Ancianos San Blas | Solicitud de voluntariado aceptada',
      html,
    );
  }

  public async sendSolicitudRechazadaEmail(
    email: string,
    nombre: string,
  ): Promise<void> {
    const html = this.buildInstitutionalTemplate({
      nombre,
      titulo: 'Solicitud de voluntariado rechazada',
      subtitulo: 'Notificación oficial del Hogar de Ancianos San Blas',
      mensajePrincipal:
        'Le informamos que, tras la revisión correspondiente, su solicitud de voluntariado no ha sido aprobada en esta ocasión.',
      mensajeSecundario:
        'Agradecemos sinceramente su interés en formar parte de nuestra labor social. Valoramos su disposición de apoyo y esperamos poder contar con usted en futuras oportunidades.',
      tipoProceso: 'Voluntariado',
      estado: 'Rechazada',
      colorEstado: '#c52238',
    });

    await this.sendMail(
      email,
      'Hogar de Ancianos San Blas | Solicitud de voluntariado rechazada',
      html,
    );
  }

  // 💰 Solicitudes de donación
  public async sendSolicitudDonacionAceptadaEmail(
    email: string,
    nombre: string,
  ): Promise<void> {
    const html = this.buildInstitutionalTemplate({
      nombre,
      titulo: 'Solicitud de donación aceptada',
      subtitulo: 'Notificación oficial del Hogar de Ancianos San Blas',
      mensajePrincipal:
        'Reciba un cordial saludo. Nos complace informarle que su solicitud de donación ha sido aceptada. Agradecemos profundamente su generosidad y su disposición para apoyar al Hogar de Ancianos San Blas.',
      mensajeSecundario:
        'En los próximos días, nuestro equipo podrá ponerse en contacto con usted para coordinar el proceso de entrega o recepción, según corresponda.',
      tipoProceso: 'Donación',
      estado: 'Aceptada',
      colorEstado: '#2e8b57',
    });

    await this.sendMail(
      email,
      'Hogar de Ancianos San Blas | Solicitud de donación aceptada',
      html,
    );
  }

  public async sendSolicitudDonacionRechazadaEmail(
    email: string,
    nombre: string,
  ): Promise<void> {
    const html = this.buildInstitutionalTemplate({
      nombre,
      titulo: 'Solicitud de donación rechazada',
      subtitulo: 'Notificación oficial del Hogar de Ancianos San Blas',
      mensajePrincipal:
        'Le informamos que su solicitud de donación no ha sido aprobada en esta ocasión, luego de la revisión administrativa correspondiente.',
      mensajeSecundario:
        'Aun así, agradecemos sinceramente su intención de colaborar con nuestra institución. Su interés y apoyo son valiosos para nuestra comunidad, y esperamos poder coincidir en futuras oportunidades.',
      tipoProceso: 'Donación',
      estado: 'Rechazada',
      colorEstado: '#c52238',
    });

    await this.sendMail(
      email,
      'Hogar de Ancianos San Blas | Solicitud de donación rechazada',
      html,
    );
  }
}