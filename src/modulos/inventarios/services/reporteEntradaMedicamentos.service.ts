
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response as ExpressResponse } from 'express';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { EntradaMedicamento } from '../entities/entradaMedicamento.entity';

@Injectable()
export class ReporteEntradaMedicamentoService {
  constructor(
    @InjectRepository(EntradaMedicamento)

    private readonly entradaMedRepo: Repository<EntradaMedicamento>,
    private readonly pdfHtml: PdfHtmlService,

  ) {}

  async generarReporteEntradasMedicamentos(anio: number, mes: number, res: ExpressResponse) {
    if (!anio || !mes) {
      throw new BadRequestException('Debe especificar año y mes.');
    }
    if (mes < 1 || mes > 12) {
      throw new BadRequestException('Mes inválido (1-12).');
    }

    const inicio = new Date(anio, mes - 1, 1, 0, 0, 0);
    const fin    = new Date(anio, mes, 1, 0, 0, 0);

    const rows = await this.entradaMedRepo
      .createQueryBuilder('em')
      .innerJoin('em.medicamento', 'm')
      .innerJoin('em.unidad_medida', 'um')
      .where('em.fechaEntrada >= :inicio AND em.fechaEntrada < :fin', { inicio, fin })
      .select('em.id', 'entrada_id')
      .addSelect("DATE_FORMAT(em.fechaEntrada, '%Y-%m-%d %H:%i')", 'fecha')
      .addSelect('em.cantidad', 'cantidad')
      .addSelect('m.nombre', 'medicamento_nombre')
      .addSelect('um.nombre', 'unidad_nombre')
      .addSelect('um.abreviatura', 'unidad_abreviatura')
      .orderBy('em.fechaEntrada', 'DESC')
      .addOrderBy('em.id', 'DESC')
      .getRawMany<{
        entrada_id: number;
        fecha: string;
        cantidad: number;
        medicamento_nombre: string;
        unidad_nombre: string;
        unidad_abreviatura: string;
      }>();

    if (!rows.length) {
      throw new NotFoundException('No hay entradas de medicamentos en ese período.');
    }

    const html = this.buildHtmlTabla({
      titulo: 'Reporte de Entradas de Medicamentos',
      anio,
      mes,
      columnas: ['Fecha', 'Nombre Medicamento', 'Unidad', 'Cantidad'],
      filas: rows.map(r => [
        r.fecha,
        r.medicamento_nombre,
        `${r.unidad_nombre} (${r.unidad_abreviatura})`,
        String(r.cantidad),
      ]),
      totalRegistros: rows.length,
    });

    const mesTexto = new Date(anio, mes - 1).toLocaleString('es-CR', { month: 'long' });
    const filename = `Reporte_Entradas_Medicamentos_${this.capitalize(mesTexto)}_${anio}.pdf`;

    await this.pdfHtml.generarDesdeHtml(html, res, {
      filename,
      waitUntil: 'networkidle0',
      ensureAssets: true,
      disposition: 'attachment',
    });
  }

  // helpers
  private esc(s: string) {
    return String(s)
      .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
      .replaceAll('"','&quot;').replaceAll("'",'&#39;');
  }
  private capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  private buildHtmlTabla(params: {
    titulo: string; anio: number; mes: number;
    columnas: string[]; filas: string[][]; totalRegistros: number;
  }) {
    const { titulo, anio, mes, columnas, filas, totalRegistros } = params;
    const mesNombre = new Date(anio, mes - 1).toLocaleString('es-CR', { month: 'long', year: 'numeric' });

    const head = columnas.map(c => `<th>${this.esc(c)}</th>`).join('');
    const body = filas.map(r => `<tr>${r.map(v => `<td>${this.esc(v)}</td>`).join('')}</tr>`).join('');

    return `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  :root { --accent:#A7074D; --text:#111; --muted:#555; --border:#d5d5d5; --bg-alt:#f7f7f7; }
  body{font-family:Arial,Helvetica,sans-serif;font-size:12px;margin:24px;color:var(--text)}
  h1{margin:0 0 8px;font-size:28px}
  .heading{display:grid;grid-template-columns:96px 1fr;gap:16px;align-items:center;margin-bottom:6px}
  .logo{width:96px;height:96px;border-radius:50%;object-fit:cover;border:none;display:block}
  .meta{margin:0 0 12px;color:var(--muted)}
  table{width:100%;border-collapse:collapse;margin-top:10px}
  th,td{border:1px solid var(--border);padding:8px 10px;vertical-align:top}
  th{background:var(--accent);color:#fff;text-align:left}
  tbody tr:nth-child(even){background:var(--bg-alt)}
  @page { margin: 40px 30px; }
</style>
</head>
<body>
  <div class="heading">
    <img class="logo" src="https://i.ibb.co/HDfRP6fX/1749848069832.png" alt="logo"/>
    <div>
      <h1>${this.esc(titulo)}</h1>
      <div class="meta">Mes: <strong>${this.esc(this.capitalize(mesNombre))}</strong></div>
    </div>
  </div>

  <div style="margin:8px 0 14px 0;"><strong>Total registros:</strong> ${totalRegistros}</div>

  <table>
    <thead><tr>${head}</tr></thead>
    <tbody>${body}</tbody>
  </table>
</body>
</html>`.trim();
  }
}
