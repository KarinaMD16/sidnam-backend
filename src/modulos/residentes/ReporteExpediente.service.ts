import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response as ExpressResponse } from 'express';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { Expediente_Residente } from '../residentes/entities/expedientes.entity';
import { Patologias } from '../residentes/entities/patologias.entity';
import { Administraciones } from '../residentes/entities/administraciones.entity';
import { AdministracionesEspeciales } from '../residentes/entities/administracionEspecial.entity';
import { capitalize } from 'src/common/utils/capitalize';
import { buildStandardPdfHtml, escapePdfHtml } from 'src/common/utils/pdfReportTemplate';
import { normalize } from 'src/common/utils/normalize';

@Injectable()
export class ReporteExpedienteService {
  constructor(
    @InjectRepository(Expediente_Residente)
    private readonly expedienteRepository: Repository<Expediente_Residente>,

    @InjectRepository(Patologias)
    private readonly patologiasRepository: Repository<Patologias>,

    @InjectRepository(Administraciones)
    private readonly administracionRepository: Repository<Administraciones>,

    @InjectRepository(AdministracionesEspeciales)
    private readonly administracionEspecialRepository: Repository<AdministracionesEspeciales>,

    private readonly pdfHtmlService: PdfHtmlService,
  ) { }

  async generarPdfExpediente(expedienteId: number, res: ExpressResponse) {

    const expediente = await this.expedienteRepository.findOne({
      where: { id_expediente: expedienteId },
      relations: ['residente', 'residente.encargados'],
    });

    if (!expediente) throw new NotFoundException('Expediente no encontrado');


   const [patologias, administraciones, administracionesEspeciales] =
    await Promise.all([
        this.patologiasRepository
        .createQueryBuilder('p')
        .leftJoin('p.expedientes', 'e')
        .where('e.id_expediente = :id', { id: expedienteId })
        .orderBy('p.nombre', 'ASC')
        .getMany(),

        this.administracionRepository
        .createQueryBuilder('a')
        .leftJoinAndSelect('a.administracionMedicamentos', 'am')
        .leftJoinAndSelect('am.medicamento', 'm')
        .leftJoinAndSelect('am.unidad', 'u')
        .where('a.expediente = :id', { id: expedienteId })
        .orderBy('a.turno', 'ASC')
        .getMany(),

        this.administracionEspecialRepository
        .createQueryBuilder('ae')
        .leftJoinAndSelect('ae.medicamento', 'm')
        .leftJoinAndSelect('ae.unidad', 'u')
        .where('ae.expediente = :id', { id: expedienteId })
        .orderBy('ae.hora', 'ASC')
        .getMany(),
    ]);


    const html = this.generarHtmlExpediente(
      expediente,
      patologias,
      administraciones,
      administracionesEspeciales,
    );

    const nombreArchivo = this.buildFilename(expediente);

    await this.pdfHtmlService.generarDesdeHtml(html, res, {
        filename: nombreArchivo,
        disposition: 'attachment',
        ensureAssets: false,
        waitUntil: 'domcontentloaded',
    });
  }

  private buildFilename(expediente: Expediente_Residente): string {
    const nombreCompleto = [
      expediente.residente.nombre,
      expediente.residente.apellido1,
      expediente.residente.apellido2,
    ]
      .filter(Boolean)
      .join(' ');

    const normalizedName = normalize(nombreCompleto)
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('_')
      .replace(/[^A-Za-z0-9_]/g, '');

    return normalizedName.length > 0
      ? `Expediente_${normalizedName}.pdf`
      : 'Expediente_Residente.pdf';
  }

  private generarHtmlExpediente(
    expediente: Expediente_Residente,
    patologias: Patologias[],
    administraciones: Administraciones[],
    administracionesEspeciales: AdministracionesEspeciales[],
  ): string {
    const residente = expediente.residente;
    const fechaHoy = new Date().toLocaleDateString('es-CR');
    const patologiasHtml = patologias.length > 0
      ? patologias.map((p, i) => `<tr>
          <td>${i + 1}</td>
          <td>${escapePdfHtml(capitalize(p.nombre))}</td>
        </tr>`).join('')
      : `<tr><td colspan="2">No hay patologías asociadas a este residente</td></tr>`;

    const administracionesHtml = administraciones.length > 0
      ? administraciones.map((adm) => `
          <div class="section">
            <div class="meta">Turno: <strong>${escapePdfHtml(adm.turno)}</strong></div>
            <div class="turnos">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Medicamento</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  ${adm.administracionMedicamentos.length > 0
                    ? adm.administracionMedicamentos.map((m, j) => `
                        <tr>
                          <td>${j + 1}</td>
                          <td>${escapePdfHtml(capitalize(m.medicamento.nombre))}</td>
                          <td>${escapePdfHtml(m.cantidad)}</td>
                          <td>${escapePdfHtml(m.unidad.abreviatura)}</td>
                        </tr>`).join('')
                    : `<tr><td colspan="4">No hay medicamentos asociados en este turno</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>`)
        .join('')
      : `
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Medicamento</th>
              <th>Cantidad</th>
              <th>Unidad</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="4">No hay medicamentos asociados a este residente</td></tr>
          </tbody>
        </table>
      `;

    const administracionesEspecialesHtml = administracionesEspeciales.length > 0
      ? administracionesEspeciales.map((ae, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${escapePdfHtml(ae.hora)}</td>
            <td>${escapePdfHtml(capitalize(ae.medicamento.nombre))}</td>
            <td>${escapePdfHtml(ae.cantidad)}</td>
            <td>${escapePdfHtml(ae.unidad.abreviatura)}</td>
          </tr>`).join('')
      : `<tr><td colspan="5">No hay medicamentos especiales asociados a este residente</td></tr>`;

    return buildStandardPdfHtml({
      title: 'Expediente de residente',
      metaLines: [`Fecha de reporte: <strong>${escapePdfHtml(fechaHoy)}</strong>`],
      extraStyles: '.turnos { max-width: 500px; }',
      bodyHtml: `
        <div class="section">
          <div class="section-title">Información del residente</div>
          <div class="box">
            <div class="info-list">
              <div class="info-row"><div class="info-label">Nombre completo:</div><div>${escapePdfHtml(`${capitalize(residente.nombre)} ${capitalize(residente.apellido1)} ${capitalize(residente.apellido2 || '')}`)}</div></div>
              <div class="info-row"><div class="info-label">Cédula:</div><div>${escapePdfHtml(residente.cedula)}</div></div>
              <div class="info-row"><div class="info-label">Sexo:</div><div>${escapePdfHtml(residente.sexo)}</div></div>
              <div class="info-row"><div class="info-label">Edad:</div><div>${escapePdfHtml(residente.edad)}</div></div>
              <div class="info-row"><div class="info-label">Estado civil:</div><div>${escapePdfHtml(residente.estado_civil)}</div></div>
              <div class="info-row"><div class="info-label">Dependencia:</div><div>${escapePdfHtml(residente.dependencia)}</div></div>
              <div class="info-row"><div class="info-label">Estado expediente:</div><div>${escapePdfHtml(expediente.estado)}</div></div>
              <div class="info-row"><div class="info-label">Tipo de pensión:</div><div>${escapePdfHtml(expediente.tipo_pension)}</div></div>
              <div class="info-row"><div class="info-label">Fecha de ingreso:</div><div>${escapePdfHtml(expediente.fecha_ingreso.toLocaleDateString('es-CR'))}</div></div>
              <div class="info-row"><div class="info-label">Fecha de cierre:</div><div>${escapePdfHtml(expediente.fecha_cierre ? expediente.fecha_cierre.toLocaleDateString('es-CR') : '-')}</div></div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Encargados</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre completo</th>
                <th>Cédula</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              ${residente.encargados && residente.encargados.length > 0
                ? residente.encargados.map((e, i) => `<tr>
                    <td>${i + 1}</td>
                    <td>${escapePdfHtml(`${capitalize(e.nombre)} ${capitalize(e.apellido1)} ${capitalize(e.apellido2 || '')}`)}</td>
                    <td>${escapePdfHtml(e.cedula)}</td>
                    <td>${escapePdfHtml(e.telefono || '')}</td>
                  </tr>`).join('')
                : `<tr><td colspan="4">No tiene encargados registrados</td></tr>`}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Enfermería</div>

          <div class="section">
            <h3>Patologías</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                ${patologiasHtml}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>Administraciones</h3>
            ${administracionesHtml}
          </div>

          <div class="section">
            <h3>Administraciones Especiales</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Hora</th>
                  <th>Medicamento</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                </tr>
              </thead>
              <tbody>
                ${administracionesEspecialesHtml}
              </tbody>
            </table>
          </div>
        </div>
      `,
    });
  }
}
