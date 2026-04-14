import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response as ExpressResponse } from 'express';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { RegistroDonacion } from '../solicitud-donacion/entities/registroDonacion.entity';
import { ReporteDonacionesMensualDto } from '../solicitud-donacion/dto/reporteDonacionMensualDto';
import { buildStandardPdfHtml, escapePdfHtml } from 'src/common/utils/pdfReportTemplate';

@Injectable()
export class ReporteDonacionesService {
  constructor(
    @InjectRepository(RegistroDonacion)
    private readonly regRepo: Repository<RegistroDonacion>,
    private readonly pdfHtmlService: PdfHtmlService,       
  ) {}

  
  async generarReporteMensual(q: ReporteDonacionesMensualDto, res: ExpressResponse) {
    const field = 'r.aprobadaEn'; 

    
    const from = new Date(Date.UTC(q.year, q.month - 1, 1, 0, 0, 0, 0));
    const to   = new Date(Date.UTC(q.year, q.month,     1, 0, 0, 0, 0));

    const registros = await this.regRepo.createQueryBuilder('r')
      .leftJoinAndSelect('r.donador', 'd')
      .andWhere(`${field} >= :from AND ${field} < :to`, { from, to })
      .orderBy('r.recibida', 'DESC')       
      .addOrderBy('r.aprobadaEn', 'DESC')  
      .getMany();

    if (!registros.length) {
      throw new NotFoundException('No hay donaciones para el mes/año seleccionado');
    }

    const html = this.generarHtmlMensual(registros, q);

   
    const mesTexto = new Date(q.year, q.month - 1, 1).toLocaleString('es-CR', { month: 'long' });
    const sanitize = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
    const filename = `Reporte_Donaciones_${sanitize(mesTexto.charAt(0).toUpperCase() + mesTexto.slice(1))}_${q.year}.pdf`;

    await this.pdfHtmlService.generarDesdeHtml(html, res, {
      filename,
      waitUntil: 'networkidle0', 
      ensureAssets: true,        
    });
  }

  
  private generarHtmlMensual(registros: RegistroDonacion[], q: ReporteDonacionesMensualDto): string {
    const mesNombre = new Date(q.year, q.month - 1, 1)
      .toLocaleString('es-CR', { month: 'long', year: 'numeric' });

    
    const total = registros.length;
    const recSi = registros.filter(r => r.recibida).length;
    const recNo = total - recSi;
    const anSi  = registros.filter(r => r.anonimo).length;
    const anNo  = total - anSi;

    
    const porUsuario = this.groupCount(
      registros.map(r => (r.aprobadaPor?.trim() || 'Sin asignar'))
    );
    const usuariosRows = Object.entries(porUsuario)
      .sort((a,b) => b[1] - a[1])
      .map(([u, c]) => `<tr><td>${this.escape(u)}</td><td class="right">${c}</td></tr>`)
      .join('');

   
    const rows = registros.map(r => {
      const d = r.donador;
      const nombreDonador = [d?.nombre, d?.apellido1, d?.apellido2].filter(Boolean).join(' ');
      return `
        <tr>
          <td class="cedula-cell">${this.escape(d?.cedula ?? '')}</td>
          <td>${this.escape(nombreDonador)}</td>
          <td>${this.escape(r.tipoDonacion ?? '')}</td>
          <td class="center">${this.sn(r.anonimo)}</td>
          <td>${this.fmt(r.aprobadaEn)}</td>
          <td>${this.escape(r.aprobadaPor ?? 'Sin asignar')}</td>
          <td class="center">${this.sn(r.recibida)}</td>
          <td>${this.fmt(r.recibidaEn)}</td>
          <td class="wrap-cell">${this.escape(r.descripcion ?? '')}</td>
          <td class="wrap-cell">${this.escape(r.observaciones ?? '')}</td>
        </tr>
      `;
    }).join('');

    return buildStandardPdfHtml({
      title: 'Reporte mensual de donaciones',
      metaLines: [
        `Mes: <strong>${escapePdfHtml(mesNombre)}</strong> | Corte por: <strong>Fecha de aprobación</strong>`,
      ],
      extraStyles: `
        .donations-detail-table {
          table-layout: fixed;
          margin-top: 0;
        }

        .donations-detail-table th,
        .donations-detail-table td {
          font-size: 10px;
          line-height: 1.35;
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .donations-detail-table th {
          font-size: 9px;
          line-height: 1.2;
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .donations-detail-table th.nowrap-header {
          white-space: nowrap;
          overflow-wrap: normal;
          word-break: normal;
        }

        .donations-detail-table .wrap-cell {
          white-space: pre-wrap;
        }

        .donations-detail-table .cedula-cell {
          font-size: 9px;
          white-space: nowrap;
          overflow-wrap: normal;
          word-break: normal;
        }

        .donations-detail-table col.cedula { width: 12%; }
        .donations-detail-table col.donador { width: 10%; }
        .donations-detail-table col.tipo { width: 7%; }
        .donations-detail-table col.anonimo { width: 6%; }
        .donations-detail-table col.aprobada-en { width: 10%; }
        .donations-detail-table col.aprobada-por { width: 10%; }
        .donations-detail-table col.recibida { width: 6%; }
        .donations-detail-table col.recibida-en { width: 10%; }
        .donations-detail-table col.descripcion { width: 14%; }
        .donations-detail-table col.observaciones { width: 14%; }
      `,
      bodyHtml: `
        <div class="two-col section">
          <div class="box">
            <h3>Resumen</h3>
            <table>
              <tbody>
                <tr><td>Total donaciones</td><td class="right">${total}</td></tr>
                <tr><td>Donadores únicos</td><td class="right">${
                  new Set(registros.map(r => r.donador?.cedula ?? r.donador?.email ?? String(r.donador?.id ?? ''))).size
                }</td></tr>
                <tr><td>Recibidas</td><td class="right">${recSi}</td></tr>
                <tr><td>No recibidas</td><td class="right">${recNo}</td></tr>
                <tr><td>Anónimas</td><td class="right">${anSi}</td></tr>
                <tr><td>No anónimas</td><td class="right">${anNo}</td></tr>
              </tbody>
            </table>
          </div>

          <div class="box">
            <h3>Aprobadas/creadas por usuario</h3>
            <table>
              <thead><tr><th>Usuario</th><th class="right">Cantidad</th></tr></thead>
              <tbody>${usuariosRows}</tbody>
            </table>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Detalle</div>
          <table class="donations-detail-table">
            <colgroup>
              <col class="cedula" />
              <col class="donador" />
              <col class="tipo" />
              <col class="anonimo" />
              <col class="aprobada-en" />
              <col class="aprobada-por" />
              <col class="recibida" />
              <col class="recibida-en" />
              <col class="descripcion" />
              <col class="observaciones" />
            </colgroup>
            <thead>
              <tr>
                <th class="nowrap-header">Cédula</th>
                <th>Donador</th>
                <th>Tipo</th>
                <th>Anón.</th>
                <th>Aprob./Creada en</th>
                <th>Aprob./Creada por</th>
                <th>Recibida</th>
                <th>Recibida en</th>
                <th>Descripción</th>
                <th class="nowrap-header">Observaciones</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `,
    });
  }

 
  private fmt(d?: Date | null): string {
    if (!d) return '';
    const x = new Date(d);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(x.getDate())}/${p(x.getMonth() + 1)}/${x.getFullYear()} ${p(x.getHours())}:${p(x.getMinutes())}`;
  }

 
  private sn(v?: boolean): string {
    if (v === true)  return 'Sí';
    if (v === false) return 'No';
    return '—';
  }

  private escape(s: string): string {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]!));
  }

  private groupCount(arr: (string | null | undefined)[]): Record<string, number> {
    const acc: Record<string, number> = {};
    for (const raw of arr) {
      const key = (raw ?? 'Sin asignar').trim() || 'Sin asignar';
      acc[key] = (acc[key] ?? 0) + 1;
    }
    return acc;
  }
}
