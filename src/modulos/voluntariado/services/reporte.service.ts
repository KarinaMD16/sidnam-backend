// src/modulos/voluntariado/services/reporte.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { Response } from 'express';
import { SolicitudAprobada } from '../entities/solicitudAprobada.entity';

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(SolicitudAprobada)
    private readonly solicitudRepo: Repository<SolicitudAprobada>,
    private readonly pdfHtmlService: PdfHtmlService,
  ) {}

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

    const html = this.generarHtml(solicitud);
    await this.pdfHtmlService.generarDesdeHtml(html, res);
  }

  private generarHtml(solicitud: SolicitudAprobada): string {
    const actividadesHtml = solicitud.actividades.map((a, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${new Date(a.fecha).toLocaleDateString()}</td>
        <td>${a.cantidadHoras}</td>
        <td>${a.actividades}</td>
      </tr>
    `).join('');

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .info { margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Reporte de Actividades</h1>
          <div class="info">
            <strong>Nombre:</strong> ${solicitud.voluntario.nombre} ${solicitud.voluntario.apellido1} ${solicitud.voluntario.apellido2}<br>
            <strong>Cédula:</strong> ${solicitud.voluntario.cedula}<br>
            <strong>Voluntariado:</strong> ${solicitud.tipoVoluntariado.nombre}<br>
            <strong>Fecha de aprobación:</strong> ${new Date(solicitud.aprobadaEn).toLocaleDateString()}<br>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Horas</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              ${actividadesHtml}
            </tbody>
          </table>
        </body>
      </html>
    `;
  }
}
