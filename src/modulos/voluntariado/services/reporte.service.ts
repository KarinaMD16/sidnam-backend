// src/modulos/voluntariado/services/reporte.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { Response } from 'express';
import { SolicitudAprobada } from '../entities/solicitudAprobada.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(SolicitudAprobada)
    private readonly solicitudRepo: Repository<SolicitudAprobada>,
    private readonly pdfHtmlService: PdfHtmlService,
  ) { }


  private obtenerLogoBase64(): string {
    const logoPath = path.join(process.cwd(), 'assets', 'hogar-san-blas.png');
    const logoBuffer = fs.readFileSync(logoPath);

    return `data:image/png;base64,${logoBuffer.toString('base64')}`;
  }


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
    const logoBase64 = this.obtenerLogoBase64();

    const actividadesHtml = solicitud.actividades.map((a, i) => `
      <tr>
        <td>${new Date(a.fecha).toLocaleDateString()}</td>
        <td>${a.cantidadHoras}</td>
        <td>${a.actividades}</td>
      </tr>
    `).join('');

    return `
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 20px;
              color: #111;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 30px;
            }

            th, td {
              border: 1px solid #c6c6c6;
              padding: 8px;
              text-align: left;
            }

            th {
              background-color: #A7074D;
              color: whitesmoke;
            }

            tr:nth-child(even) {
              background-color: whitesmoke;
            }

            .info {
              margin-left: 20px;
            }

            .intro {
              margin-top: 20px;
            }

            img {
              width: 100px;
              height: 100px;
              object-fit: cover;
              border-radius: 50%;
            }

            .heading {
              display: flex;
              gap: 20px;
              align-items: center;
            }
          </style>
        </head>
        <body>
          <div class="heading">
            <img src="${logoBase64}" alt="Logo">
            <h1>Reporte de Actividades</h1>
          </div>

          <div class="intro">
            <strong>Información del voluntario: </strong><br>

            <div class="info">
              <strong>Nombre:</strong> ${solicitud.voluntario.nombre} ${solicitud.voluntario.apellido1} ${solicitud.voluntario.apellido2} <br>
              <strong>Cédula:</strong> ${solicitud.voluntario.cedula}<br>
              <strong>Voluntariado:</strong> ${solicitud.tipoVoluntariado.nombre}<br>
              <strong>Correo electrónico:</strong> ${solicitud.voluntario.email} <br>
              <strong>Cantidad de horas a cumplir:</strong> ${solicitud.cantidadHoras} <br>
            </div>
          </div>

          <table>
            <thead>
              <tr>
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
