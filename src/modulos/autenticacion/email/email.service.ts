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

  // Diseño minimalista y corporativo, paleta: #A7074D, #DBBA6B, #1A1924, #FDF6F9, #FFF8E8
  return `
  <div style="margin:0; padding:32px; background:#FDF6F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#1A1924;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:720px; margin:0 auto;">
      <!-- Top bar -->
      <tr>
        <td style="padding:12px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:middle;">
                ${logoBase64 ? `<img src="${logoBase64}" alt="Hogar San Blas" style="height:44px; display:block;" />` : `<div style="font-weight:700; color:#A7074D; font-size:18px;">Hogar de Ancianos San Blas</div>`}
              </td>
              <td style="text-align:right; vertical-align:middle; font-size:13px; color:#6b6b6b;">
                <span style="background:#FFF8E8; color:#1A1924; padding:6px 10px; border-radius:999px; border:1px solid #DBBA6B; font-weight:600;">${subtitulo}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Main card -->
      <tr>
        <td>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:14px; overflow:hidden; border:1px solid rgba(26,25,36,0.06);">
            <tr>
              <!-- Left column: colored stripe + badge -->
              <td width="120" style="background:linear-gradient(180deg, ${colorEstado} 0%, rgba(0,0,0,0.02) 100%); vertical-align:top; padding:22px; text-align:center;">
                <div style="width:72px; height:72px; margin:0 auto 12px auto; border-radius:50%; background:#ffffff; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 18px rgba(0,0,0,0.06);">
                  <span style="font-size:28px; font-weight:700; color:${colorEstado};">${estado === 'Aceptada' ? '✓' : '✕'}</span>
                </div>
                <div style="font-size:13px; color:#ffffff; font-weight:700;">${estado}</div>
                <div style="font-size:12px; color:rgba(255,255,255,0.9); margin-top:6px;">${tipoProceso}</div>
              </td>

              <!-- Right column: content -->
              <td style="padding:28px;">
                <h1 style="margin:0 0 8px 0; font-size:20px; color:#1A1924; font-weight:700;">${titulo}</h1>
                <p style="margin:0 0 18px 0; font-size:14px; color:#6b6b6b;">Estimado(a) <strong style="color:#1A1924;">${nombre}</strong>,</p>

                <p style="margin:0 0 16px 0; font-size:15px; line-height:1.6; color:#333;">${mensajePrincipal}</p>

                ${mensajeSecundario ? `<p style="margin:0 0 18px 0; font-size:14px; line-height:1.6; color:#555;">${mensajeSecundario}</p>` : ''}

                <!-- CTA destacado -->
                <div style="margin-top:18px;">
                  <a href="#" style="display:inline-block; background:${colorEstado === '#c52238' ? '#c52238' : '#A7074D'}; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:10px; font-weight:700; font-size:14px; box-shadow:0 6px 18px rgba(167,7,77,0.18);">Ver detalles</a>
                </div>

                <!-- Subtle divider -->
                <div style="height:1px; background:linear-gradient(90deg, rgba(26,25,36,0.04), rgba(26,25,36,0.02)); margin:20px 0;"></div>

                <!-- Small print and institutional note -->
                <p style="margin:0; font-size:12px; color:#8a8a8a;">Si necesita asistencia adicional, responda a este correo o visite nuestras instalaciones para coordinar la asignación de actividades.</p>

                <div style="margin-top:12px; padding:12px; background:#FFF8E8; border-radius:8px; border:1px solid #DBBA6B;">
                  <p style="margin:0; font-size:13px; color:#1A1924;">Este mensaje ha sido emitido por el <strong>Hogar de Ancianos San Blas</strong> como parte del seguimiento institucional.</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:18px 0; text-align:center; color:#9b9b9b; font-size:12px;">
          <div style="display:flex; justify-content:center; gap:12px; align-items:center; flex-wrap:wrap;">
            <span>© Hogar de Ancianos San Blas</span>
            <span style="color:#DBBA6B;">•</span>
            <span>Correo generado automáticamente</span>
          </div>
        </td>
      </tr>
    </table>
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