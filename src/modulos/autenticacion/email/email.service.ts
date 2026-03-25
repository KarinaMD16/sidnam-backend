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
      <div style="margin:0; padding:32px 16px; background-color:#f6f3ee;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e6dcc8; border-radius:24px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08);">
          
          <div style="background:linear-gradient(135deg, #a10d5e 0%, #7d0e49 100%); padding:32px 24px; text-align:center;">
            ${
              logoBase64
                ? `<img src="${logoBase64}" alt="Hogar de Ancianos San Blas" style="width:110px; max-width:100%; height:auto; display:block; margin:0 auto 16px auto;" />`
                : ''
            }
            <div style="font-family: Arial, sans-serif; color:#f3d27a; font-size:13px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">
              Hogar de Ancianos San Blas
            </div>
            <div style="font-family: Arial, sans-serif; color:#ffffff; font-size:24px; font-weight:bold; margin-top:10px; line-height:1.3;">
              ${titulo}
            </div>
            <div style="font-family: Arial, sans-serif; color:#f9e7bf; font-size:14px; margin-top:8px; line-height:1.5;">
              ${subtitulo}
            </div>
          </div>

          <div style="padding:32px 28px 20px 28px; font-family: Arial, sans-serif; color:#2f2f2f;">
            <p style="margin:0 0 16px 0; font-size:16px; line-height:1.7;">
              Estimado(a) <strong>${nombre}</strong>,
            </p>

            <div style="margin:0 0 24px 0; padding:16px 18px; border-left:5px solid ${colorEstado}; background:#faf7f2; border-radius:12px;">
              <p style="margin:0; font-size:15px; line-height:1.7; color:#3f3f3f;">
                <strong>Estado de la solicitud:</strong>
                <span style="color:${colorEstado}; font-weight:bold;">${estado}</span>
              </p>
              <p style="margin:8px 0 0 0; font-size:15px; line-height:1.7; color:#3f3f3f;">
                <strong>Tipo de proceso:</strong> ${tipoProceso}
              </p>
            </div>

            <p style="margin:0 0 16px 0; font-size:15px; line-height:1.8;">
              ${mensajePrincipal}
            </p>

            ${
              mensajeSecundario
                ? `<p style="margin:0 0 16px 0; font-size:15px; line-height:1.8; color:#4a4a4a;">
                    ${mensajeSecundario}
                  </p>`
                : ''
            }

            <p style="margin:0 0 16px 0; font-size:15px; line-height:1.8;">
              Este mensaje ha sido enviado por el <strong>Hogar de Ancianos San Blas, Nicoya, Guanacaste</strong>,
              como parte del seguimiento institucional de su solicitud.
            </p>

            <div style="margin-top:28px; padding:18px; background:#fff8e8; border:1px solid #efd99a; border-radius:14px;">
              <p style="margin:0; font-size:14px; line-height:1.7; color:#5a4a1a;">
                Para cualquier consulta adicional, puede responder a este correo o comunicarse por los canales oficiales del Hogar de Ancianos San Blas.
              </p>
            </div>
          </div>

          <div style="padding:20px 28px 30px 28px; font-family: Arial, sans-serif; color:#2f2f2f;">
            <p style="margin:0 0 8px 0; font-size:15px;">Atentamente,</p>
            <p style="margin:0; font-size:15px; font-weight:bold; color:#a10d5e;">
              Administración
            </p>
            <p style="margin:4px 0 0 0; font-size:14px; color:#555;">
              Hogar de Ancianos San Blas
            </p>
            <p style="margin:4px 0 0 0; font-size:14px; color:#555;">
              Nicoya, Guanacaste, Costa Rica
            </p>
          </div>

          <div style="background:#f4ecdb; padding:14px 20px; text-align:center; border-top:1px solid #e6dcc8;">
            <p style="margin:0; font-family: Arial, sans-serif; font-size:12px; line-height:1.6; color:#6a665f;">
              Este es un correo informativo generado por el sistema institucional del Hogar de Ancianos San Blas.
            </p>
          </div>
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