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

  private getLogoUrl(): string {
  return 'https://hogarsanblas.com/logo_hogar_san_blas.png';
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
  } = params;

  const logoUrl = this.getLogoUrl();
  const isAccepted = estado === 'Aceptada';

  // Paleta institucional
  const brandPrimary = '#A7074D';
  const brandAccent = '#DBBA6B';
  const background = '#F8F4EF';
  const cardBackground = '#FFFFFF';
  const softGold = '#F6E7BE';
  const softRose = '#F8D7E6';
  const border = '#E9DED2';
  const textPrimary = '#241915';
  const textSecondary = '#6B5A52';

  // Estados usando la misma identidad
  const stateBg = isAccepted ? '#F7EAF1' : '#FFF4F7';
  const stateBorder = isAccepted ? '#D88AAF' : '#E7A8C3';
  const stateText = brandPrimary;
  const badgeText = isAccepted ? 'Aprobada' : 'No aprobada';

  return `
  <div style="margin:0; padding:0; background:${background};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${background}; margin:0; padding:36px 16px; width:100%;">
      <tr>
        <td align="center">

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;">

            <!-- Header de marca -->
           <tr>
              <td style="padding:0 0 18px 0;">
                <img
                  src="${logoUrl}"
                  alt="Hogar de Ancianos San Blas"
                  width="105"
                  style="
                    display:block;
                    width:105px;
                    max-width:105px;
                    height:auto;
                    border:0;
                  "
                />
              </td>
            </tr>
            <!-- Card principal -->
            <tr>
              <td style="
                background:${cardBackground};
                border:1px solid ${border};
                border-radius:24px;
                overflow:hidden;
                box-shadow:0 8px 24px rgba(167, 7, 77, 0.06);
              ">

                <!-- Franja superior institucional -->
                <div style="height:8px; line-height:8px; font-size:0; background:linear-gradient(90deg, ${brandPrimary} 0%, ${brandPrimary} 70%, ${brandAccent} 100%);">
                  &nbsp;
                </div>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                  <!-- Encabezado -->
                  <tr>
                    <td style="padding:34px 34px 12px 34px;">
                      <div style="
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:12px;
                        letter-spacing:1.2px;
                        text-transform:uppercase;
                        color:${brandPrimary};
                        font-weight:700;
                        margin:0 0 14px 0;
                      ">
                        ${tipoProceso} · Comunicación oficial
                      </div>

                      <h1 style="
                        margin:0;
                        font-family:Georgia, 'Times New Roman', serif;
                        font-size:32px;
                        line-height:1.18;
                        color:${textPrimary};
                        font-weight:700;
                      ">
                        ${titulo}
                      </h1>
                    </td>
                  </tr>

                  <!-- Línea/acento -->
                  <tr>
                    <td style="padding:0 34px 22px 34px;">
                      <div style="
                        width:72px;
                        height:4px;
                        background:${brandAccent};
                        border-radius:999px;
                      "></div>
                    </td>
                  </tr>

                  <!-- Saludo -->
                  <tr>
                    <td style="padding:0 34px 8px 34px;">
                      <p style="
                        margin:0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:16px;
                        line-height:1.8;
                        color:${textPrimary};
                      ">
                        Estimado(a) <strong>${nombre}</strong>,
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:0 34px 24px 34px;">
                      <p style="
                        margin:0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:14px;
                        line-height:1.8;
                        color:${textSecondary};
                      ">
                        ${subtitulo}
                      </p>
                    </td>
                  </tr>

                  <!-- Bloque destacado -->
                  <tr>
                    <td style="padding:0 34px 24px 34px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="
                        background:linear-gradient(180deg, #FFFDF8 0%, #FFF9EF 100%);
                        border:1px solid #F0DFC0;
                        border-radius:18px;
                      ">
                        <tr>
                          <td style="padding:24px;">
                            <p style="
                              margin:0;
                              font-family:Arial, Helvetica, sans-serif;
                              font-size:16px;
                              line-height:1.85;
                              color:${textPrimary};
                            ">
                              ${mensajePrincipal}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  ${
                    mensajeSecundario
                      ? `
                  <tr>
                    <td style="padding:0 34px 28px 34px;">
                      <p style="
                        margin:0;
                        font-family:Arial, Helvetica, sans-serif;
                        font-size:15px;
                        line-height:1.8;
                        color:${textSecondary};
                      ">
                        ${mensajeSecundario}
                      </p>
                    </td>
                  </tr>
                  `
                      : ''
                  }

                  <!-- Cierre -->
                  <tr>
                    <td style="padding:0 34px 32px 34px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${border};">
                        <tr>
                          <td style="padding-top:22px;">
                            <p style="
                              margin:0 0 10px 0;
                              font-family:Arial, Helvetica, sans-serif;
                              font-size:13px;
                              line-height:1.75;
                              color:${textSecondary};
                            ">
                              Este mensaje fue emitido por el
                              <strong style="color:${brandPrimary};">Hogar de Ancianos San Blas</strong>
                              como parte del seguimiento administrativo correspondiente.
                            </p>

                            <p style="
                              margin:0;
                              font-family:Arial, Helvetica, sans-serif;
                              font-size:13px;
                              line-height:1.75;
                              color:${textSecondary};
                            ">
                              Ante cualquier consulta, puede responder a este correo o comunicarse mediante los canales oficiales de la institución.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:18px 12px 0 12px;">
                <p style="
                  margin:0;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:12px;
                  line-height:1.6;
                  color:${textSecondary};
                ">
                  © Hogar de Ancianos San Blas · Correo generado automáticamente
                </p>
              </td>
            </tr>

          </table>
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