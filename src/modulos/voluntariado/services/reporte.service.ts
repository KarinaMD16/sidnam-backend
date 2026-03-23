// src/modulos/voluntariado/services/reporte.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { Response } from 'express';
import { SolicitudAprobada } from '../entities/solicitudAprobada.entity';
import { buildStandardPdfHtml, escapePdfHtml } from 'src/common/utils/pdfReportTemplate';

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(SolicitudAprobada)
    private readonly solicitudRepo: Repository<SolicitudAprobada>,
    private readonly pdfHtmlService: PdfHtmlService,
  ) { }

  async generarReporteActividades(solicitudId: number, res: Response) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id: solicitudId },
      relations: ['actividades', 'voluntario', 'tipoVoluntariado'],
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (!solicitud.actividades || solicitud.actividades.length === 0) {
      throw new NotFoundException('No hay actividades registradas para esta solicitud');
    }

    solicitud.cantidadHoras = solicitud.cantidadHoras ?? 0;

    const html = this.generarHtml(solicitud);
    await this.pdfHtmlService.generarDesdeHtml(html, res, {
      waitUntil: 'domcontentloaded',
      ensureAssets: false,
    });
  }

  private generarHtml(solicitud: SolicitudAprobada): string {
    const fechaHoy = new Date().toLocaleDateString('es-CR');
    const actividadesHtml = solicitud.actividades.map((a) => `
      <tr>
        <td>${escapePdfHtml(new Date(a.fecha).toLocaleDateString())}</td>
        <td>${escapePdfHtml(a.cantidadHoras)}</td>
        <td>${escapePdfHtml(a.actividades)}</td>
      </tr>
    `).join('');

    return buildStandardPdfHtml({
      title: 'Reporte de Actividades',
      metaLines: [`Fecha de reporte: <strong>${escapePdfHtml(fechaHoy)}</strong>`],
      bodyHtml: `
        <div class="section">
          <div class="section-title">Información del voluntario</div>
          <div class="box">
            <div class="info-list">
              <div class="info-row"><div class="info-label">Nombre:</div><div>${escapePdfHtml(`${solicitud.voluntario.nombre} ${solicitud.voluntario.apellido1} ${solicitud.voluntario.apellido2}`)}</div></div>
              <div class="info-row"><div class="info-label">Cédula:</div><div>${escapePdfHtml(solicitud.voluntario.cedula)}</div></div>
              <div class="info-row"><div class="info-label">Voluntariado:</div><div>${escapePdfHtml(solicitud.tipoVoluntariado.nombre)}</div></div>
              <div class="info-row"><div class="info-label">Correo electrónico:</div><div>${escapePdfHtml(solicitud.voluntario.email)}</div></div>
              <div class="info-row"><div class="info-label">Cantidad de horas:</div><div>${escapePdfHtml(solicitud.cantidadHoras)}</div></div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Actividades registradas</div>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Horas</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>${actividadesHtml}</tbody>
          </table>
        </div>
      `,
    });
  }
}
