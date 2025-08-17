import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { RegistroDonacion } from '../solicitud-donacion/entities/registroDonacion.entity';

@Injectable()
export class ReporteDonacionesService {
  constructor(
    @InjectRepository(RegistroDonacion)
    private readonly regRepo: Repository<RegistroDonacion>,
    private readonly pdfHtmlService: PdfHtmlService,
  ) {}

  async generarReporteDonacion(id: number, res: Response) {
    const registro = await this.regRepo.findOne({
      where: { id },
      relations: ['donador'],
    });

    if (!registro) {
      throw new NotFoundException('Registro de donación no encontrado');
    }

    const html = this.generarHtmlRegistro(registro);
    // nombre de archivo bonito (ver PdfHtmlService más abajo)
    await this.pdfHtmlService.generarDesdeHtml(html, res);
  }

  // ---------- Helpers ----------
  private fmtDate(d?: Date | null): string {
    if (!d) return '';
    // dd/mm/yyyy HH:MM
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dt = new Date(d);
    return `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  }

  private sn(b?: boolean): string {
    return b ? 'Sí' : 'No';
  }

  private generarHtmlRegistro(r: RegistroDonacion): string {
    const d = r.donador;
    return `
      <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Krona+One&family=Poppins:wght@300;400;500;600;700&display=swap');
            body{ font-family:"Poppins",sans-serif; padding:20px; }
            table{ width:100%; border-collapse:collapse; margin-top:20px; }
            th,td{ border:1px solid #c6c6c6; padding:8px; text-align:left; }
            th{ background:#A7074D; color:#fff; }
            tr:nth-child(even){ background:#f5f5f5; }
            .heading{ display:flex; gap:20px; align-items:center; }
            img{ width:100px; }
            .info{ margin-left:20px; }
            .grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px 24px; margin-top:10px; }
            .section-title{ margin-top:20px; font-weight:600; }
            .badge{ display:inline-block; padding:2px 8px; border-radius:8px; background:#eee; font-size:12px; }
          </style>
        </head>
        <body>
          <div class="heading">
            <img src="https://i.ibb.co/HDfRP6fX/1749848069832.png" alt="logo"/>
            <h1>Registro de Donación</h1>
          </div>

          <div class="section-title">Información del donador</div>
          <div class="grid">
            <div><strong>Nombre:</strong> ${[d?.nombre, d?.apellido1, d?.apellido2].filter(Boolean).join(' ')}</div>
            <div><strong>Cédula:</strong> ${d?.cedula ?? ''}</div>
            <div><strong>Teléfono:</strong> ${d?.telefono ?? ''}</div>
            <div><strong>Email:</strong> ${d?.email ?? ''}</div>
          </div>

          <div class="section-title">Detalle de la donación</div>
          <div class="grid">
            <div><strong>Tipo de donación:</strong> ${r.tipoDonacion ?? ''}</div>
            <div><strong>Anónimo:</strong> <span class="badge">${this.sn(r.anonimo)}</span></div>
            <div><strong>Descripción:</strong> ${r.descripcion ?? ''}</div>
            <div><strong>Observaciones:</strong> ${r.observaciones ?? ''}</div>
            <div><strong>Aprobada por:</strong> ${r.aprobadaPor ?? ''}</div>
            <div><strong>Aprobada en:</strong> ${this.fmtDate(r.aprobadaEn)}</div>
            <div><strong>Recibida:</strong> <span class="badge">${this.sn(r.recibida)}</span></div>
            <div><strong>Recibida por:</strong> ${r.recibidaPor ?? ''}</div>
            <div><strong>Recibida en:</strong> ${this.fmtDate(r.recibidaEn)}</div>
          </div>
        </body>
      </html>
    `;
  }
}
